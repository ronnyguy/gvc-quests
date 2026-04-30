// Real holder data from Alchemy + GVC API
export async function GET() {
  try {
    const CONTRACT = '0xB8Ea78fcaCEf50d41375E44E6814ebbA36Bb33c4';
    const BURN = new Set([
      '0x000000000000000000000000000000000000dead',
      '0x0000000000000000000000000000000000000000',
    ]);

    // ── 1. Fetch all holders from Alchemy (paginated) ──────────────────────────
    const allOwners = [];
    let pageKey = null;

    do {
      const url = new URL(
        `https://eth-mainnet.g.alchemy.com/nft/v3/demo/getOwnersForContract`
      );
      url.searchParams.set('contractAddress', CONTRACT);
      url.searchParams.set('withTokenBalances', 'true');
      if (pageKey) url.searchParams.set('pageKey', pageKey);

      const res = await fetch(url.toString());
      const data = await res.json();
      allOwners.push(...(data.owners || []));
      pageKey = data.pageKey || null;
    } while (pageKey);

    // Build holder map (address → count), exclude burn addresses
    const holderMap = {};
    for (const owner of allOwners) {
      const addr = owner.ownerAddress.toLowerCase();
      if (BURN.has(addr)) continue;
      holderMap[addr] = owner.tokenBalances.reduce(
        (sum, t) => sum + parseInt(t.balance || '1', 10),
        0
      );
    }

    // Sort by count, take top 100
    const sorted = Object.entries(holderMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 100);

    // ── 2. Fetch 30-day accumulator list ──────────────────────────────────────
    let accumulatorSet = new Set();
    let accumulatorMap = {};
    try {
      const actRes = await fetch('https://api-hazel-pi-72.vercel.app/api/activity');
      const actData = await actRes.json();
      for (const a of actData.accumulators || []) {
        const addr = a.address.toLowerCase();
        accumulatorSet.add(addr);
        accumulatorMap[addr] = a.buysThisMonth;
      }
    } catch (e) {
      console.warn('Activity fetch failed:', e.message);
    }

    // ── 3. Resolve known Twitter/ENS handles from GVC API ─────────────────────
    const holders = await Promise.all(
      sorted.map(async ([address, nfts], i) => {
        let twitter = '';
        let ens = '';
        try {
          const wRes = await fetch(
            `https://api-hazel-pi-72.vercel.app/api/wallet/${address}`
          );
          const wData = await wRes.json();
          twitter = wData.twitter || wData.twitterHandle || '';
          ens = wData.ens || wData.ensName || '';
        } catch {}

        const isAccumulating = accumulatorSet.has(address);
        const buysThisMonth = accumulatorMap[address] || 0;

        // Tier based on real holdings
        let tier;
        if (nfts >= 25) tier = 'whale';
        else if (nfts >= 10) tier = 'core';
        else if (nfts >= 5) tier = 'solid';
        else tier = 'collector';

        return {
          rank: i + 1,
          address,
          nfts,
          twitter,
          ens,
          tier,
          isAccumulating,
          buysThisMonth,
        };
      })
    );

    return Response.json({ holders, fetchedAt: Date.now() });
  } catch (err) {
    console.error('Holders route error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
