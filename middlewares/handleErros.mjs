import { validationResult } from "express-validator";

/**
 * Middleware para manejar errores de validación provenientes de express-validator.
 */
export const handleErrors = () => (req, res, next) => {
  const errors = validationResult(req);

  const acceptHeader = req.headers.accept || "";
  const wantsHTML = acceptHeader.includes("html");
  const wantsJSON = acceptHeader.includes("json");

  const old = { ...req.body };

  if (Array.isArray(old.borders)) old.borders = old.borders.join(", ");

  if (errors.isEmpty()) {
    console.log("✅ [VALID] Sin errores, continúa →");
    return next();
  }

  console.warn("📛 [VALID] Errores:", errors.array());

  const isEditing =
    req.method.toUpperCase() === "PUT" ||
    req.originalUrl.includes("/editar") ||
    (/\/countries\/[^/]+$/.test(req.originalUrl) && req.method.toUpperCase() === "PUT");

  if (wantsHTML) {
    const view = isEditing ? "editCountry" : "addCountry";
    const payload = {
      errors: errors.array(),
      old,
      country: isEditing ? { _id: req.params.id, ...req.body } : undefined,
      countryId: req.params.id, 
      title: isEditing ? "Editar país" : "Agregar país"
    };
    return res.status(400).render(view, payload);
  }

  if (wantsJSON) {
    return res.status(400).json({
      mensaje: "Datos inválidos",
      errors: errors.array(),
      old,
    });
  }

  return res.status(406).send("Not Acceptable: Solo HTML o JSON.");
};
