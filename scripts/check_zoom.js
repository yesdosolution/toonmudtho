async function checkZoom() {
  const list = await (await fetch('http://localhost:9222/json/list')).json();
  const page = list.find(t => t.type === 'page') || list[0];
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r));

  function send(m, p = {}) {
    return new Promise(r => {
      const id = Math.floor(Math.random() * 1000);
      const h = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.id === id) {
          ws.removeEventListener('message', h);
          r(msg.result);
        }
      };
      ws.addEventListener('message', h);
      ws.send(JSON.stringify({ id, method: m, params: p }));
    });
  }

  const zoomLevels = [1.0, 1.25, 1.5, 2.0];
  const results = {};

  for (const zoom of zoomLevels) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: Math.round(1440 / zoom),
      height: Math.round(900 / zoom),
      deviceScaleFactor: zoom,
      mobile: false
    });
    await send('Page.navigate', { url: 'http://localhost:8080/' });
    await new Promise(r => setTimeout(r, 600));

    const res = await send('Runtime.evaluate', {
      expression: `(() => {
        const w = window.innerWidth;
        const scrollW = document.documentElement.scrollWidth;
        return {
          windowWidth: w,
          scrollWidth: scrollW,
          noOverflow: scrollW <= w + 2
        };
      })()`,
      returnByValue: true
    });
    results[`${Math.round(zoom * 100)}%`] = res.result.value;
  }

  console.log('Zoom Audit Results:', JSON.stringify(results, null, 2));
  ws.close();
}

checkZoom().catch(console.error);
