const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const flash = require('connect-flash');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const sanitizeHtml = require('sanitize-html');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const dbP = path.join(__dirname, 'database/users.json');
const FOTO_PADRAO = 'https://raw.githubusercontent.com/uploader762/dat3/main/uploads/3fae03-1776528467067.jpg';

const { plugins } = require('./routes/config');
plugins(app);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
secret: process.env.SESSION_SECRET || 'troque-isso-pow',// bota algo mais seguro
resave: false,
saveUninitialized: false,
cookie: {
secure: process.env.NODE_ENV === 'production',
httpOnly: true,
maxAge: 1000 * 60 * 60 * 24
}
}));

app.use(flash());
app.use((req, res, next) => {
res.locals.user = req.session.user || null;
next();
});

const { adminRoutes } = require('./routes/admin');
adminRoutes(app);

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/', limiter);

if (!fs.existsSync(path.join(__dirname, 'database'))) {
fs.mkdirSync(path.join(__dirname, 'database'), { recursive: true });
}
if (!fs.existsSync(dbP)) {
fs.writeFileSync(dbP, JSON.stringify([], null, 2));
}

function loadUsers() {
try {
return JSON.parse(fs.readFileSync(dbP, 'utf8')) || [];
} catch { return []; }
}

function saveUsers(users) {
fs.writeFileSync(dbP, JSON.stringify(users, null, 2));
}

function gerarKey(len = 6) {
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function safeUser(u) {
return {
id: u.id,
username: u.username,
foto: u.foto,
capa: u.capa,
level: u.level || 1,
xp: u.xp || 0,
totalRequests: u.totalRequests || 100,
adm: u.adm || false,
premium: u.premium || false,
key: u.key,
};
}

function auth(req, res, next) {
if (!req.session.user) return res.redirect('/login');
next();
}

app.get('/', (req, res) => res.redirect(req.session.user ? '/dash' : '/login'));
app.get('/login', (req, res) => req.session.user ? res.redirect('/dash') : res.render('login', { title: 'Login · Base API' }));
app.get('/registro', (req, res) => req.session.user ? res.redirect('/dash') : res.render('registro', { title: 'Criar conta · Base API' }));

app.get('/dash', auth, (req, res) => {
const users = loadUsers();
const user = users.find(u => u.username === req.session.user.username);
if (!user) return res.redirect('/login');
const xpNesse = (user.level || 1) * 50;
const xpPorcentagem = Math.min(Math.round(((user.xp || 0) / xpNesse) * 100), 100);

const ranking = [...users]
.sort((a, b) => (b.xp || 0) - (a.xp || 0))
.slice(0, 7)
.map(u => ({ name: u.username, xp: u.xp || 0, foto: u.foto || FOTO_PADRAO, adm: u.adm || false, premium: u.premium || false }));

res.render('dash', {
title: 'DASH · OBITO API',
user: safeUser(user),
stats: { totalRequests: user.totalRequests || 0, level: user.level || 1, xp: user.xp || 0, xpNesse, xpPorcentagem, key: user.key },
ranking
});
});

app.get('/perfil', auth, (req, res) => {
const user = loadUsers().find(u => u.username === req.session.user.username);
if (!user) return res.redirect('/login');
res.render('perfil', {
title: 'PERFIL · OBITO API',
user: safeUser(user),
success_msg: req.flash('success'),
error_msg: req.flash('error')
});
});

app.get('/perfil/editar', auth, (req, res) => {
const user = loadUsers().find(u => u.username === req.session.user.username);
if (!user) return res.redirect('/login');
res.render('editar-perfil', {
title: 'EDITAR PERFIL · OBITO API',
user: safeUser(user),
success_msg: req.flash('success'),
error_msg: req.flash('error')
});
});

app.get('/logout', (req, res) => req.session.destroy(() => res.redirect('/login')));

app.post('/api/login', async (req, res) => {
const { username, password } = req.body;
if (!username || !password) return res.json({ success: false, message: 'Preencha todos os campos' });

const users = loadUsers();
const user = users.find(u => u.username === username);
if (!user || !(await bcrypt.compare(password, user.password))) {
return res.json({ success: false, message: 'Credenciais inválidas' });
}
req.session.user = safeUser(user);
res.json({ success: true });
});

app.post('/api/registro', async (req, res) => {
let { username, email, password } = req.body;
if (!username || !email || !password) return res.json({ success: false, message: 'Preencha todos os campos' });

username = sanitizeHtml(username, { allowedTags: [], allowedAttributes: {} }).trim();
if (!username) return res.json({ success: false, message: 'Usuário inválido' });
if (password.length < 6) return res.json({ success: false, message: 'Senha muito curta (mín. 6)' });

const users = loadUsers();
if (users.some(u => u.username === username)) return res.json({ success: false, message: 'Usuário já existe' });
if (users.some(u => u.email === email)) return res.json({ success: false, message: 'E-mail já cadastrado' });

const newUser = {
id: (users.length ? Math.max(...users.map(u => u.id || 0)) : 0) + 1,
username, email,
password: await bcrypt.hash(password, 10),
key: gerarKey(),
level: 1, xp: 0, totalRequests: 0,
foto: FOTO_PADRAO, 
capa: 'https://raw.githubusercontent.com/uploader762/dat3/main/uploads/3fae03-1776528467067.jpg',
adm: false, premium: false,
createdAt: new Date().toISOString()
};

users.push(newUser);
saveUsers(users);
req.session.user = safeUser(newUser);
res.json({ success: true });
});

app.post('/api/perfil/editar', auth, (req, res) => {
const { username, foto, capa, key } = req.body;
const users = loadUsers();
const idx = users.findIndex(u => u.username === req.session.user.username);
  if (idx === -1) return res.json({ success: false, message: 'Usuário não encontrado' });

const user = users[idx];

if (username && username !== user.username) {
if (username.length < 3 || username.length > 20) return res.json({ success: false, message: 'Usuário deve ter entre 3 e 20 caracteres' });
if (users.some(u => u.username === username && u.id !== user.id)) return res.json({ success: false, message: 'Usuário já em uso' });
user.username = username.trim();
}
if (foto && foto.startsWith('https://')) user.foto = foto.trim();
if (capa && capa.startsWith('https://')) user.capa = capa.trim();
if (key && (user.premium || user.adm)) user.key = key.trim();

saveUsers(users);
req.session.user = safeUser(user);
req.flash('success', 'Perfil atualizado!');
res.json({ success: true });
});

app.use((req, res) => res.status(404).render('404', { title: '404 · Base API' }));
app.use((err, req, res, next) => {
console.error(err.stack);
res.status(500).render('500', { title: '500 · Base API' });
});

app.listen(PORT, '0.0.0.0', () => console.log(`🚀 http://localhost:${PORT}`));