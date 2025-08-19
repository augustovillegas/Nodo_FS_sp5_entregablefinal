import express from "express";
import dotenv from "dotenv";
import path from "path";
import cron from "node-cron";
import methodOverride from "method-override";
import expressLayouts from "express-ejs-layouts";
import resetear from "./scripts/resetCountries.mjs";
import countryRoutes from "./routes/countryRoutes.mjs";
import { conectarDB } from "./config/dbConfig.mjs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3008;

// ───────────────── Middlewares base
app.use((req, _res, next) => { console.log(`➡️  [REQ] ${req.method} ${req.originalUrl}`);
  next();
});
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.json());
app.use(express.static("public"));

// ───────────────── DB
await conectarDB();

// ───────────────── EJS
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(expressLayouts);
app.set("layout", "layout");
app.use((req, res, next) => {
  const cleanPath = req.path.split("/")[1];
  res.locals.page = cleanPath === "" ? "home" : cleanPath;
  next();
});

// ───────────────── Rutas
app.get("/", (_req, res) => res.render("landing", { title: "Inicio" }));
app.get("/info", (_req, res) => res.render("informacion", { title: "Información" }));
app.use("/api", countryRoutes);

// ───────────────── 404
app.use((req, res) => {
  console.warn("⚠️  [404] Ruta no encontrada:", req.originalUrl);
  res.status(404).send({ mensaje: "404 Not Found - Ruta no encontrada" });
});

// ───────────────── cron reset 5 min.
cron.schedule("*/5 * * * *", async () => {
  console.log("⏰ [CRON] Ejecutando reset automático cada 5 minutos");
  await resetear();
});

// ───────────────── Arranque (solo si NO es test)
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log("##########################");
    console.log("######## API REST ########");
    console.log("##########################");
    console.log(`Servidor OK: http://localhost:${PORT}/`);
  });
}

export default app;
