export async function POST(request) {
  const { tweetUrl, expectedHandle } = await request.json();

  if (!tweetUrl || !expectedHandle) {
    return Response.json({ verified: false, error: 'Missing tweetUrl or expectedHandle' }, { status: 400 });
  }

  const tweetIdMatch = tweetUrl.match(/\/status\/(\d+)/);
  if (!tweetIdMatch) {
    return Response.json({ verified: false, error: 'Invalid tweet URL' }, { status: 400 });
  }

  const tweetId = tweetIdMatch[1];
  const urlHandleMatch = tweetUrl.match(/(?:x|twitter)\.com\/([^\/]+)\/status/);
  const urlHandle = urlHandleMatch ? urlHandleMatch[1].toLowerCase() : null;

  try {
    const response = await fetch(`https://api.twitterapi.io/twitter/tweets?tweet_ids=${tweetId}`, {
      headers: {
        'X-API-Key': process.env.TWITTERAPI_KEY,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    const tweets = data.tweets || data.data || [];
    const tweet = Array.isArray(tweets) ? tweets[0] : tweets;

    if (!tweet) {
      return Response.json({ verified: false, error: 'Tweet not found or is private' });
    }

    const tweetAuthor = (tweet.author?.userName || tweet.user?.screen_name || tweet.username || urlHandle || '').toLowerCase();
    const expected = expectedHandle.toLowerCase().replace('@', '');
    const handleMatch = tweetAuthor === expected;
    const tweetText = tweet.text || tweet.full_text || '';
    const tagsGVC = tweetText.toLowerCase().includes('@goodvibesclub');

    if (handleMatch && tagsGVC) {
      return Response.json({ verified: true, tweetId, author: tweetAuthor, tagsGVC, preview: tweetText.slice(0, 100) });
    }

    return Response.json({
      verified: false,
      tweetId,
      author: tweetAuthor,
      handleMatch,
      tagsGVC,
      error: !handleMatch ? `Tweet posted by @${tweetAuthor}, not @${expected}` : 'Tweet does not tag @GoodVibesClub'
    });

  } catch (err) {
    return Response.json({ verified: false, error: 'Verification failed' }, { status: 500 });
  }
}
