const { lerUsers, salvarUsers } = require('./config');

function authAdmin(req, res, next) {
if (!req.session || !req.session.user) return res.redirect('/login');
const users = lerUsers();
const u = users.find(u => u.username === req.session.user.username);
if (!u || !u.adm) return res.status(403).send('Acesso negado');
next();
}

function adminRoutes(app) {
app.get('/admin', authAdmin, (req, res) => {
const users = lerUsers();
res.render('admin', {
title: 'Admin · OBITO API',
users,
user: req.session.user
});
});

app.get('/api/admin/stats', authAdmin, (req, res) => {
const users = lerUsers();
const totalRequests = users.reduce((a, u) => a + (u.totalRequests || 0), 0);
const totalXp = users.reduce((a, u) => a + (u.xp || 0), 0);
res.json({ ok: true, totalUsers: users.length, totalRequests, totalXp });
});

app.get('/api/admin/usuario/:id', authAdmin, (req, res) => {
const users = lerUsers();
const u = users.find(u => String(u.id) === String(req.params.id));
if (!u) return res.status(404).json({ ok: false, msg: 'Usuário não encontrado' });
const { password, ...safe } = u;
res.json({ ok: true, user: safe });
});

app.post('/api/admin/usuario/atualizar', authAdmin, (req, res) => {
const { id, premium, key, totalRequests, xp, level } = req.body;
const users = lerUsers();
const idx = users.findIndex(u => String(u.id) === String(id));
if (idx === -1) return res.status(404).json({ ok: false, msg: 'Usuário não encontrado' });
users[idx].premium = !!premium;
if (key && key.trim()) users[idx].key = key.trim();
if (typeof totalRequests === 'number') users[idx].totalRequests = totalRequests;
if (typeof xp === 'number') users[idx].xp = xp;
if (typeof level === 'number' && level >= 1) users[idx].level = level;
if (salvarUsers(users)) res.json({ ok: true });
else res.status(500).json({ ok: false, msg: 'Erro ao salvar' });
});
}

module.exports = { adminRoutes };