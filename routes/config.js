const fs = require('fs');
const path = require('path');

const db = path.join(__dirname, '../database/users.json');

function lerUsers() {
try {
const d = JSON.parse(fs.readFileSync(db, 'utf8'));
return Array.isArray(d) ? d : [];
} catch { return []; }
}

function salvarUsers(lista) {
try {
fs.writeFileSync(db, JSON.stringify(lista, null, 2));
return true;
} catch { return false; }
}

async function check_key(req, res, next) {
const { apitoken } = req.query;
if (!apitoken) return res.status(401).json({ ok: false, msg: 'Token não fornecido' });

const users = lerUsers();
const i = users.findIndex(u => u.key === apitoken);
if (i === -1) return res.status(401).json({ ok: false, msg: 'Token inválido' });

const u = users[i];
if ((u.totalRequests || 0) <= 0)
return res.status(403).json({ ok: false, msg: 'Sem requests. Compre comigo: wa.me/557398343428' });

u.totalRequests--;
const xp = (u.xp || 0) + 10;
const lvl = u.level || 1;
u.xp = xp >= lvl * 50 ? xp % 50 : xp;
if (xp >= lvl * 50) u.level = lvl + Math.floor(xp / 50);

users[i] = u;
if (!salvarUsers(users)) return res.status(500).json({ ok: false, msg: 'Erro ao salvar' });

req.usuario = u;
next();
}

function plugins(app) {
const dir = path.join(__dirname, 'plugins');
if (!fs.existsSync(dir)) return console.warn('Pasta plugins não existe');

fs.readdirSync(dir)
.filter(f => f.endsWith('.js'))
.forEach(f => {
try {
const p = require(path.join(dir, f));
if (!p.rota || !p.run) return console.warn(`${f}: falta 'rota' ou 'run'`);
app.get(p.rota, check_key, p.run);
console.log(`${f} - GET ${p.rota}`);
} catch (e) {
console.error(`${f}:`, e.message);
}
});
}

module.exports = { lerUsers, salvarUsers, check_key, plugins };
