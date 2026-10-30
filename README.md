# Super Intelligent Beauty ($AgenC) — agencsibeauty.vip

Static site (HTML/CSS/JS, no build) for the $AgenC meme on **Robinhood Chain**.

- Hero: Three.js (self-hosted `js/vendor/three.module.min.js`) — the **official 2D portrait** as a lit, textured plane relit per-pixel (cursor key light, gold rim, red eye glint + flare), with a gold aura, strong mouse tilt and parallax, a double halo, god-rays with engraved rings, orbiting 3D gold rings, bokeh depth-of-field gold dust and falling raven feathers. No invented 3D face mesh.
- Lenis smooth scroll + GSAP ScrollTrigger; self-hosted fonts (Cormorant Garamond, Inter Tight, JetBrains Mono).
- Timeline: all 9 posts from NARRATIVE_TWEETS.md (Acts 1–3) as **official X embeds** (`blockquote.twitter-tweet` + `platform.twitter.com/widgets.js`, dark theme). Each card also shows the post's still / video from `img/tweet-media/` so the page isn't empty if X fails to load.
- Media gallery (`#media`): the name-reveal photo as a large feature, plus the 5 post videos (720p `*-web.mp4`, faststart) that play muted when scrolled into view; tap one to play with sound.
- Banner: 3:1 key art `img/agenc-banner-3x1.*`; `og.jpg` = banner on a blurred 1200×630 background.
- CSP in `vercel.json` allows only platform.twitter.com / syndication / twimg hosts needed by the embeds.
- Meme vault: pending (memes not yet delivered).
- **CA: TBA · X: Soon · Telegram: none.** Buy (Uniswap `chain=robinhood`), Chart (DexScreener robinhood) and Explorer (Blockscout) are "Soon" placeholders. Fill `CA` / `X_URL` in `js/main.js` only with officially announced values.

Fan meme / parody on Robinhood Chain. Not affiliated with @tetsuoai, @a_g_e_n_c, or Elon Musk.
