import Anthropic from '@anthropic-ai/sdk';
import crypto from 'crypto';

// ── Vision prompts per quest ID ────────────────────────────────────────────────
const VISION_PROMPTS = {
  'weekly-activation':
    'Does this image show an AI-generated full body character in a stylized digital art style? Answer Yes or No first, then explain briefly.',
  'rt-comment-2':
    'Does this image show a character in a T-pose with arms extended horizontally? Answer Yes or No first, then explain briefly.',
  'full-body-pose':
    'Does this image show a character placed in a scene or environment — not just a plain character on a white or plain background? Answer Yes or No first, then explain briefly.',
};

// Module-level fallback when Vercel KV is not configured
// Persists within warm Lambda instances only — swap for @vercel/kv in production
const memHashStore = new Map();

function getImageUrl(tweet) {
  return (
    tweet.photos?.[0]?.url ??
    tweet.media?.[0]?.url ??
    tweet.entities?.media?.[0]?.media_url_https ??
    tweet.extended_entities?.media?.[0]?.media_url_https ??
    null
  );
}

async function runVisionCheck(imageBuffer, contentType, questId) {
  if (!VISION_PROMPTS[questId]) return null;
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('ANTHROPIC_API_KEY not set — skipping vision check');
    return null;
  }

  const VALID_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const mediaType = VALID_TYPES.find(t => contentType.startsWith(t)) ?? 'image/jpeg';
  const base64 = Buffer.from(imageBuffer).toString('base64');

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 256,
    messages: [{
      role: 'user',
      content: [
        { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
        { type: 'text', text: VISION_PROMPTS[questId] },
      ],
    }],
  });

  const text = msg.content[0]?.text ?? '';
  const pass = /^yes/i.test(text.trimStart());
  return { pass, reason: text };
}

async function isDuplicate(questId, hash) {
  if (process.env.KV_REST_API_URL) {
    try {
      const { kv } = await import('@vercel/kv');
      return Boolean(await kv.sismember(`gvc:hashes:${questId}`, hash));
    } catch (e) {
      console.warn('KV sismember failed, falling back to in-memory:', e.message);
    }
  }
  return memHashStore.has(`${questId}:${hash}`);
}

async function storeHash(questId, hash) {
  if (process.env.KV_REST_API_URL) {
    try {
      const { kv } = await import('@vercel/kv');
      await kv.sadd(`gvc:hashes:${questId}`, hash);
      return;
    } catch (e) {
      console.warn('KV sadd failed, falling back to in-memory:', e.message);
    }
  }
  memHashStore.set(`${questId}:${hash}`, Date.now());
}

// ── Main handler ───────────────────────────────────────────────────────────────
export async function POST(request) {
  const { tweetUrl, expectedHandle, questId, walletAddress } = await request.json();

  if (!tweetUrl || !expectedHandle) {
    return Response.json(
      { verified: false, error: 'Missing tweetUrl or expectedHandle' },
      { status: 400 }
    );
  }

  const tweetIdMatch = tweetUrl.match(/\/status\/(\d+)/);
  if (!tweetIdMatch) {
    return Response.json({ verified: false, error: 'Invalid tweet URL' }, { status: 400 });
  }

  const tweetId = tweetIdMatch[1];
  const urlHandleMatch = tweetUrl.match(/(?:x|twitter)\.com\/([^/]+)\/status/);
  const urlHandle = urlHandleMatch ? urlHandleMatch[1].toLowerCase() : null;

  // ── Step 1: TwitterAPI.io — confirm tweet is real and from the right handle ──
  let tweet;
  try {
    const res = await fetch(`https://api.twitterapi.io/twitter/tweets?tweet_ids=${tweetId}`, {
      headers: { 'X-API-Key': process.env.TWITTERAPI_KEY, 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    const tweets = data.tweets || data.data || [];
    tweet = Array.isArray(tweets) ? tweets[0] : tweets;

    if (!tweet) {
      return Response.json({ verified: false, error: 'Tweet not found or is private' });
    }

    const author = (
      tweet.author?.userName ||
      tweet.user?.screen_name ||
      tweet.username ||
      urlHandle ||
      ''
    ).toLowerCase();
    const expected = expectedHandle.toLowerCase().replace('@', '');

    if (author !== expected) {
      return Response.json({
        verified: false,
        error: `Tweet posted by @${author}, not @${expected}`,
      });
    }

    const tweetText = tweet.text || tweet.full_text || '';
    if (!tweetText.toLowerCase().includes('@goodvibesclub')) {
      return Response.json({ verified: false, error: 'Tweet does not tag @GoodVibesClub' });
    }
  } catch {
    return Response.json({ verified: false, error: 'Tweet verification failed' }, { status: 500 });
  }

  // ── Steps 2 & 3: Image checks (only for quests that require them) ───────────
  const needsImageCheck = questId && Boolean(VISION_PROMPTS[questId]);

  if (needsImageCheck) {
    const imageUrl = getImageUrl(tweet);

    if (!imageUrl) {
      return Response.json({
        verified: false,
        error: 'No image found in your tweet. This quest requires an image.',
      });
    }

    // Fetch image once, reuse buffer for both vision + hashing
    let imageBuffer;
    let contentType = 'image/jpeg';
    try {
      const imgRes = await fetch(imageUrl);
      if (!imgRes.ok) {
        return Response.json({ verified: false, error: 'Could not fetch tweet image' });
      }
      contentType = imgRes.headers.get('content-type') ?? 'image/jpeg';
      imageBuffer = await imgRes.arrayBuffer();
    } catch {
      return Response.json({ verified: false, error: 'Could not fetch tweet image' });
    }

    // ── Step 2: Claude Haiku vision check ─────────────────────────────────────
    try {
      const vision = await runVisionCheck(imageBuffer, contentType, questId);
      if (vision && !vision.pass) {
        return Response.json({
          verified: false,
          error: `Image check failed: ${vision.reason}`,
        });
      }
    } catch (err) {
      // Log but don't block — unexpected errors shouldn't lock users out
      console.error('Vision check error:', err);
    }

    // ── Step 3: SHA-256 duplicate hash check ──────────────────────────────────
    const hash = crypto
      .createHash('sha256')
      .update(Buffer.from(imageBuffer))
      .digest('hex');

    try {
      if (await isDuplicate(questId, hash)) {
        return Response.json({ verified: false, error: 'This image has already been submitted.' });
      }
      await storeHash(questId, hash);
    } catch (err) {
      console.error('Hash check error:', err);
    }
  }

  return Response.json({ verified: true, tweetId, imageChecked: needsImageCheck });
}
