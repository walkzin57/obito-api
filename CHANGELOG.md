# CHANGELOG

## 23/05/2026

### Frontend
- Sidebar: tirei o texto OBITO API e coloquei a imagem como banner
- Sidebar: arrumei o scroll que não funcionava
- Login/registro: fundo com grid, card transparente e foto no topo
- Logout: antes era button, agora é link funcionando

### Backend
- Rota via plugin (yt-search) - pasta routes/plugins
- Chaves, limite de requisições e middleware (check_key)

### Próximos passos
- ~~Página de administração~~
- ~~Atualização páginas de perfil~~

## 31/05/2026

### Frontend
- Perfil: redesign completo, avatar com borda animada, barra de xp, chave oculta com botão de revelar
- Editar perfil: preview ao vivo de avatar, capa e nome enquanto digita
- Admin: página nova com stats, lista de usuários com busca e edição inline
- 404: redesign com rosto animado no zero feito só em css

### Backend
- Admin: rotas /admin, /api/admin/stats, /api/admin/usuario/:id e /api/admin/usuario/atualizar
- Admin: proteção por middleware, só usuários com adm: true acessam