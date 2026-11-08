// Servidor local para el mando PS5. Sin dependencias: solo Node + playactor.
// Uso: node server.js   (opcional: PS5_IP=192.168.1.50 node server.js)
const http = require('http'), fs = require('fs'), path = require('path');
const { execFile } = require('child_process');

const PORT = process.env.PORT || 3000;
const IP = process.env.PS5_IP ? ['--ip', process.env.PS5_IP] : [];
const DATA = path.join(__dirname, 'ps5-data.json');

let data = { seconds: 0 };
try { data = JSON.parse(fs.readFileSync(DATA, 'utf8')); } catch {}
let status = 'unknown', timer = null, timerEnd = 0, last = Date.now();

const pa = (cmd) => new Promise((resolve) =>
  execFile('playactor', [cmd, ...IP], { timeout: 30000 }, (err, out, errOut) =>
    resolve({ ok: !err, out: (out || '') + (errOut || '') })));

async function refresh() {
  const r = await pa('check');
  status = /awake/i.test(r.out) ? 'awake'
    : /standby|rest/i.test(r.out) ? 'standby'
    : r.ok ? 'unknown' : 'offline';
  const now = Date.now();
  if (status === 'awake') {
    data.seconds += (now - last) / 1000;
    try { fs.writeFileSync(DATA, JSON.stringify(data)); } catch {}
  }
  last = now;
}
refresh();
setInterval(refresh, 20000);

function clearTimer() { clearTimeout(timer); timer = null; timerEnd = 0; }

const send = (res, obj, code = 200) => {
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(obj));
};
const body = (req) => new Promise((resolve) => {
  let s = ''; req.on('data', (c) => (s += c));
  req.on('end', () => { try { resolve(JSON.parse(s || '{}')); } catch { resolve({}); } });
});
const snapshot = () => ({ status, seconds: Math.round(data.seconds), timerEnd });

http.createServer(async (req, res) => {
  const url = req.url.split('?')[0];

  if (req.method === 'GET' && url === '/api/status') return send(res, snapshot());

  if (req.method === 'POST' && url === '/api/wake') {
    const r = await pa('wake');
    refresh();
    return send(res, { ok: r.ok, detail: r.ok ? '' : r.out.slice(-300) });
  }
  if (req.method === 'POST' && url === '/api/standby') {
    clearTimer();
    const r = await pa('standby');
    refresh();
    return send(res, { ok: r.ok, detail: r.ok ? '' : r.out.slice(-300) });
  }
  if (req.method === 'POST' && url === '/api/sleep-timer') {
    const { minutes } = await body(req);
    clearTimer();
    if (minutes > 0) {
      timerEnd = Date.now() + minutes * 60000;
      timer = setTimeout(async () => { clearTimer(); await pa('standby'); refresh(); }, minutes * 60000);
    }
    return send(res, snapshot());
  }

  if (req.method === 'GET' && (url === '/' || url === '/index.html')) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(fs.readFileSync(path.join(__dirname, 'index.html')));
  }
  send(res, { error: 'not found' }, 404);
}).listen(PORT, '0.0.0.0', () => console.log('Mando PS5 listo en http://localhost:' + PORT));
