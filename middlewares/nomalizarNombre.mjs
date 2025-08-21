export const normalizarNombre = (req, res, next) => {
  if (!req.body.name && req.body["name.official"]) {
    req.body.name = { official: req.body["name.official"].trim() };
    delete req.body["name.official"];
  }
  next();
};