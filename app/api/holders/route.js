// Names imported from GVC CRM spreadsheet (last synced 2026-05-01)
const KNOWN_HOLDERS = {
  '0xd0cc2b0efb168bfe1f94a948d8df70fa10257196': { name: 'VibeSTR', twitter: '', discord: '' },
  '0xd8c629221bf930e10163d8db769324a3b5a9d276': { name: '888', twitter: '', discord: '' },
  '0x93886649b07888129fa320eb95756c35cf80d732': { name: 'Serc', twitter: '', discord: '' },
  '0x2327263845fe237a4aa6024d4d8d20d5c361177e': { name: 'Aly', twitter: '', discord: 'Aly' },
  '0x2d13c884c4c418664abb1b4a7f491dd89247e42e': { name: 'DGMD', twitter: '', discord: '' },
  '0xf41b389e0c1950dc0b16c9498eae77131cc08a56': { name: 'Gondi', twitter: '', discord: '' },
  '0xf65b99ce6dc5f6c556172bcc0ff27d3665a7d9a8': { name: 'Gondi', twitter: '', discord: '' },
  '0x990b86889d561dc15baf5cbe0670cc2f13396d28': { name: 'DappPunk', twitter: '', discord: '' },
  '0x544071711d26867ee9e2bc6eb8146655da78e069': { name: 'RonnyGuy', twitter: '', discord: '' },
  '0x6d60d0e5afa322affb5792230ee800d4d656fef6': { name: 'Coin98', twitter: '', discord: '' },
  '0x05b51b4056fd3ee6c911ac4b5d1d632a547a057f': { name: 'Kyle T', twitter: '', discord: '' },
  '0xb2580c5e3d49f9dc13508bc6cbc312619442c28c': { name: 'Cubsfan', twitter: '', discord: '' },
  '0xe07beab80ba982c181d1c71005b42805353cbfc5': { name: 'GhostKid', twitter: '', discord: '' },
  '0x0e4162080f761a70054d1b4b415ba0f357e710da': { name: 'GVC Treasury', twitter: '', discord: '' },
  '0x66575a01288dcdb5abbe2d0a4a96b8d61116355b': { name: 'Jawrr', twitter: '', discord: '' },
  '0x08f189a5983980cfb5b613065ad5fbf39c62fc59': { name: 'Frisky', twitter: '', discord: '' },
  '0xe81e4f553514821f1fc4a08f743e26ec9f1307d4': { name: 'Chris Guyot', twitter: '', discord: '' },
  '0xd00ae6f9eb43e90e2c6468ab9a9faa7e4e9ec6d2': { name: 'Swollen', twitter: '', discord: '' },
  '0x9a600ed67b3daec644b8d0f8298ac5cea3fa5688': { name: 'Mystery whale', twitter: '', discord: '' },
  '0x3569a929293ba38ab1482e102c8089b46d79d4f4': { name: 'Callmedaddy', twitter: '', discord: '' },
  '0x9723cc792c32dca2744690f99103d095ea149e82': { name: 'Samy', twitter: '', discord: '' },
  '0x8f689e3c86e207cc1031a4b89d3073704042e5cc': { name: 'VibesStrategy', twitter: '', discord: '' },
  '0xa799242db91ec215c5a2f6628f4cceda9b478727': { name: 'Warner', twitter: '', discord: '' },
  '0x8450cf769ccf7fd060936ba2b023ca8f9903f9c4': { name: 'Charlie frog', twitter: '', discord: '' },
  '0x13e47408172596e97d99b0d3802d44409378f0e9': { name: 'Killer Niz', twitter: '', discord: '' },
  '0xf76a07f67e1f6f9db8ebba3ee9acb6b8933f89f0': { name: 'Tylersmom', twitter: '', discord: '' },
  '0xb758e98c2c99883353d2ab34c4d7c550e4871aa9': { name: 'Onward', twitter: '', discord: '' },
  '0x47efa06855b712ea57254b6aa256e8d58e4e87ab': { name: 'MrGoldman', twitter: '', discord: '' },
  '0x819fbb2d9880d23792fd9d1cde4c153bf9956344': { name: 'ChinoLatino', twitter: '', discord: '' },
  '0x9c60e5cc2b9c017b693446bea871f86deb00d556': { name: 'Cryptogeek_90', twitter: '', discord: '' },
  '0xd9c00b9cdb1d45cf265d1925eb1d004ee04d9f69': { name: 'Techie', twitter: '', discord: '' },
  '0x9a4efc5d49cd3de21db17439b36ea466e739e86b': { name: '888 - Vibefoot', twitter: '', discord: '' },
  '0x3c0e5916b2f228eb237667f2ad895e0aaa7635a3': { name: 'DrFrankenvibes', twitter: 'DrFrankenvibes', discord: '' },
  '0xaab859a381ca303d3743808ba9faee92c5d1f5de': { name: 'Gabo-Vault', twitter: '', discord: '' },
  '0x9a3a654ae9a916f85244a738467b83dedf376180': { name: 'Ty Vault', twitter: '', discord: '' },
  '0xb394f1aa30ba874df3ae6097bf4c2474b2d8f3ac': { name: 'HANS', twitter: '', discord: '' },
  '0x3fbe2fd902d278e3f05575149505f998445ea4b0': { name: 'Sencrazy', twitter: 'sencrazy_', discord: '' },
  '0x337101def3eeb6f06e071efe02216274507937bb': { name: 'SuperRareJohn', twitter: '', discord: '' },
  '0xcbc7e8a39a0ec84d6b0e8e0dd98655f348ecd44f': { name: 'Melted Vault', twitter: '', discord: '' },
  '0xceb1d2d9c218f1f798cca82722fee1816111d31f': { name: 'FarmerRon', twitter: '', discord: '' },
  '0x77df289854f479a8b7d34f8e35c6ed88f79e50da': { name: 'Nico', twitter: '', discord: '' },
  '0x7171087f6dce536d05f709e2f945eab2f3cdadaf': { name: 'i_am_a', twitter: '', discord: '' },
  '0x335e19b3f5dcfa2e398ee7d5ff430a1f8ccc88b2': { name: 'Jonathan Perkins', twitter: '', discord: '' },
  '0x3730ac4e22e893159daf6902a32be937a70d0ffc': { name: 'LGS', twitter: '', discord: '' },
  '0x01deef8b494a5539239ace5da7a88b1075edf192': { name: 'Dort', twitter: '', discord: '' },
  '0x86286d93d79a9e5b78de97cbbc8dcaba0f2489fc': { name: 'Zack Yanger', twitter: '', discord: '' },
  '0x2546cf80eb6fb4ee0f22e1a9803fb268ff7b591d': { name: 'Warner', twitter: '', discord: '' },
  '0x1b4bf2d6fc540d243c96c11d808e97522fee6e1a': { name: 'CaptainCoolGuy', twitter: '', discord: '' },
  '0x92874617434413b02a71a04e2e3b39b2c34a7cf6': { name: 'CousinCash', twitter: '', discord: '' },
  '0x86ad68874399b09a2428162e323f65b566f662e3': { name: 'EA', twitter: '', discord: '' },
  '0xc30df6822dd5779f576a0c532fac6a7e293fafd9': { name: 'Anon', twitter: '', discord: '' },
  '0xac1e7beae9fcf9b4f294cd534cd0b1ae1ef44793': { name: 'Economist', twitter: '', discord: '' },
  '0x5a31f5087b3e2bc4f8db5fa7d8502f0afc9be98b': { name: 'Mendez', twitter: '', discord: '' },
  '0x0dccafbf01442ac219ba721e02a1b01352873b52': { name: 'MauxFaux', twitter: '', discord: '' },
  // ENS-resolved Twitter handles
  '0x250d5b7fe0eeeb0b24b0429c5c4cc4a58d63f6a4': { name: 'AdamWeitsman', twitter: 'AdamWeitsman', discord: '' },
  '0x2a13ccc40f25f5a1c52ebcadafd3eeee39e5eeDE': { name: 'goldenbronny', twitter: '', discord: '' },
  '0x47efa06855b712ea57254b6aa256e8d58e4e87ab': { name: 'MrGoldman', twitter: 'Mr_Goldman_eth', discord: '' },
};

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

        // Merge known holder data from spreadsheet import
        const known = KNOWN_HOLDERS[address] || {};

        return {
          rank: i + 1,
          address,
          nfts,
          twitter: known.twitter || twitter,
          ens,
          tier,
          isAccumulating,
          buysThisMonth,
          knownName: known.name || '',
          knownTwitter: known.twitter || '',
          knownDiscord: known.discord || '',
        };
      })
    );

    return Response.json({ holders, fetchedAt: Date.now() });
  } catch (err) {
    console.error('Holders route error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
