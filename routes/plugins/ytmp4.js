const { downloadVideo } = require("fallen-yt");

module.exports = {
  rota: "/api/dl/ytmp4", // nome da rota exemplo http://localhost:3000/api/dl/ytmp3?url=

  async run(req, res) {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Falta parametro "url"',
      });
    }
    try {
      const results = await downloadVideo(url);
      res.status(200).json({
        sucesso: true,
        data: results,
      });
    } catch (e) {
      return res.status(500).json({ sucesso: false, mensagem: e.message });
    }
  },
};
