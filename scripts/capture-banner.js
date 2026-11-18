const { chromium } = require('playwright');
const W = +process.env.W || 960, H = +process.env.H || 320, DPR = +process.env.DPR || 1.5, N = +process.env.N || 165, FPS = 15, OUT = process.env.OUT || 'f', SINGLE = process.env.SINGLE;
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: DPR });
  await p.clock.install();
  await p.goto('http://localhost:8765/', { waitUntil: 'load' });
  await p.clock.runFor(2500);
  await p.getByRole('button', { name: 'ASCII' }).first().click();
  await p.getByRole('button', { name: 'Hide text' }).first().click();
  await p.mouse.move(-50, -50);  // park the cursor; sharks follow or circle a recent cursor and bolt from clicks
  await p.clock.runFor(22000);   // let cursor-follow (16 s) and click alarms wear off before recording
  await p.evaluate(() => {
    const css = document.createElement('style');
    css.textContent = `header, nav.gauge, .intro, .resurface, .specimen, aside, main, section { visibility: hidden !important; }
      #ov { position: fixed; inset: 0; z-index: 50; pointer-events: none; display: flex; flex-direction: column; justify-content: center; padding-left: 7%; color: #dbe9e8; }
      #ov .k { font: 500 11px 'JetBrains Mono', monospace; letter-spacing: .22em; text-transform: uppercase; color: #8fd0c8; margin-bottom: 10px; text-shadow: 0 2px 10px #021014; }
      #ov h1 { margin: 0; font: 800 92px/0.9 'Bricolage Grotesque', sans-serif; letter-spacing: -.04em; text-shadow: 0 6px 30px rgba(1,10,14,.85); }
      #ov p { margin: 16px 0 0; max-width: 470px; font: 400 17px/1.42 'Bricolage Grotesque', sans-serif; color: #c9dad9; text-shadow: 0 2px 14px #021014, 0 0 4px #021014; }`;
    document.head.appendChild(css);
    const d = document.createElement('div'); d.id = 'ov';
    d.innerHTML = `<div class="k">[01] Sunlight zone · 0 m</div><h1>Maxyo66</h1><p>Hey, I’m Max, a game developer from Florida. I make games and the tools I use to make them.</p>`;
    document.body.appendChild(d);
  });
  await p.evaluate(() => document.fonts.ready);
  await p.clock.runFor(500);
  for (let i = 0; i < N; i++) {
    await p.screenshot({ path: `${OUT}/${String(i).padStart(4, '0')}.png` });
    if (SINGLE) break;
    await p.clock.runFor(+process.env.STEP || 16);  // whole rAF ticks (16 ms) per frame so motion is even
  }
  await b.close();
})();
