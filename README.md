<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0d0d0d,50:7b00ff,100:00ffe0&height=200&section=header&text=OBITO%20API&fontSize=70&fontColor=ffffff&fontAlignY=38&desc=base+de+autenticação+pronta+pra+uso&descAlignY=58&descSize=16&animation=fadeIn" width="100%"/>

<br/>

![Node](https://img.shields.io/badge/Node.js-18+-00ffe0?style=for-the-badge&logo=node.js&logoColor=00ffe0&labelColor=0d0d0d)
![Express](https://img.shields.io/badge/Express-4.x-7b00ff?style=for-the-badge&logo=express&logoColor=7b00ff&labelColor=0d0d0d)
![JSON DB](https://img.shields.io/badge/Database-JSON-00ffe0?style=for-the-badge&logo=json&logoColor=00ffe0&labelColor=0d0d0d)
![Status](https://img.shields.io/badge/status-online-7b00ff?style=for-the-badge&labelColor=0d0d0d)

</div>

---

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:0d0d0d,100:7b00ff&height=2&section=header" width="100%"/>

## ⠀

<div align="center">

```
  login  ·  registro  ·  dashboard  ·  perfil  ·  xp  ·  api keys  ·  rate limit  ·  admin
```

</div>

## ⠀

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:7b00ff,100:00ffe0&height=2" width="100%"/>

<br/>

## definição

> base sólida pra quem quer subir uma API com sistema de usuários sem montar tudo do zero.
> já vem com tudo que importa — **login, registro, dashboard, perfil, XP por uso, API Keys e painel admin**.
> banco em JSON. sem MySQL. sem MongoDB.

<br/>

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:00ffe0,100:7b00ff&height=2" width="100%"/>

<br/>

## instalação

```bash
git clone https://github.com/walkzin57/obito-api.git
cd obito-api
npm install
```

configure o `.env` na raiz:

```env
PORT=5445
SESSION_SECRET=coloca-algo-seguro-aqui
NODE_ENV=development
```

rode:

```bash
npm start
# 🚀 http://localhost:5445
```

<br/>

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:7b00ff,100:00ffe0&height=2" width="100%"/>

<br/>

## estrutura

```
obito-api/
├── database/
│   └── users.json
├── public/
│   └── css/
│       └── main.css
├── views/
│   ├── dash.ejs
│   ├── login.ejs
│   ├── registro.ejs
│   ├── perfil.ejs
│   ├── editar-perfil.ejs
│   ├── admin.ejs
│   ├── 404.ejs
│   └── 500.ejs
├── routes/
│   ├── config.js
│   ├── admin.js
│   └── plugins/
│       ├── yt-search.js
│       ├── ytmp3.js
│       └── ytmp4.js
├── index.js
├── package.json
└── .env
```

<br/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:00ffe0,50:7b00ff,100:0d0d0d&height=120&section=footer&fontColor=ffffff&animation=fadeIn" width="100%"/>

<div align="center">

made with 🖤 by **[+𝟕𝟑 | 𝚂𝚁. 𝐀𝐧֟፝𝐨̷𝐧𝐢𝐦𝐨̷.𝐣𝐬 </>](https://github.com/walkzin57)**

</div>