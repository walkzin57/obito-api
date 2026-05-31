const yts = require('yt-search')

module.exports = {
rota: '/api/search/yt',

async run(req, res) {
const { q } = req.query;
if (!q) {
return res.status(400).json({
successo: false,
mensagem: 'Parâmetro "q" é obrigatório'
});
}

try {
const searchResults = await yts(q);
if (!searchResults || !searchResults.videos || searchResults.videos.length === 0) {
return res.status(404).json({
successo: false,
mensagem: 'Nenhum resultado encontrado para a busca'
});
}
const videos = searchResults.videos.map(video => ({
title: video.title,
url: video.url,
duration: video.timestamp,
durationSeconds: video.duration,
views: video.views,
author: video.author.name,
authorUrl: video.author.url,
thumbnail: video.thumbnail,
description: video.description,
published: video.ago
}));
return res.json({
successo: true,
data: {
total: videos.length,
videos
}
})
} catch (e) {
return res.status(500).json({ ok: false, msg: e.message });
}
}
};
