import "dotenv/config";
import axios from "axios";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import { conectarDB } from "../config/dbConfig.mjs";
import { Country } from "../models/country.mjs";

const bootTime = new Date().toISOString();
console.log("🚀 [SEED] Boot seedCountries.mjs @", bootTime);

const thisFile = fileURLToPath(import.meta.url);
const invoked = process.argv[1] ? path.resolve(process.argv[1]) : "";
const IS_CLI = (() => {
  try {
    return path.resolve(thisFile) === path.resolve(invoked) || process.env.npm_lifecycle_event === "seed:countries";
  } catch {
    return import.meta.main === true;
  }
})();
console.log("🧭 [SEED] IS_CLI:", IS_CLI);

const rawBase = process.env.RESTCOUNTRY_URL;
if (!rawBase) {
  console.error("⛔ [SEED] Falta RESTCOUNTRY_URL en .env");
  process.exit(1);
}

const BASE = rawBase.replace(/\/region\/america(\b|\/)?$/, "/region/americas");
const URL = `${BASE}?fields=name,translations,languages,capital,borders,area,population,gini,timezones,flags`;
console.log("🌐 [SEED] URL objetivo: [RESTCOUNTRY_API]");

const toArray = (v) => (Array.isArray(v) ? v : v == null ? [] : [v]);

const tieneEspanol = (item) =>
  !!(item?.languages && typeof item.languages === "object" && Object.prototype.hasOwnProperty.call(item.languages, "spa"));

const pickString = (v) => (typeof v === "string" ? v.trim() : "");

const extraerNombre = (it) => pickString(it?.translations?.spa?.official) || pickString(it?.name?.official);

const extraerCapital = (it) => {
  const caps = toArray(it?.capital)
    .map(pickString)
    .filter((s) => s.length >= 3 && s.length <= 90);
  return caps[0] || "Sin Registro";
};

const extraerBorders = (it) =>
  Array.from(
    new Set(
      toArray(it?.borders)
        .map((s) => String(s || "").toUpperCase().trim())
        .filter((s) => /^[A-Z]{3}$/.test(s))
    )
  );

const extraerGini = (it) => {
  const g = it?.gini;
  if (!g || typeof g !== "object") return undefined;
  const years = Object.keys(g).sort();
  const val = Number(g[years.at(-1)]);
  return Number.isFinite(val) ? val : undefined;
};

const normalizarTimezone = (tz) => {
  if (!tz) return "";
  let s = String(Array.isArray(tz) ? tz[0] : tz).trim().replace(/\u2212/g, "-").toUpperCase();
  if (!s.startsWith("UTC")) {
    if (s.startsWith("+") || s.startsWith("-")) s = "UTC" + s;
    else if (s === "UTC") s = "UTC+00:00";
  }
  const m = s.match(/^UTC(?:\s*)?([+-])\s*(\d{1,2})(?::?(\d{2}))?$/);
  if (!m) return s;
  const sign = m[1];
  const hh = String(m[2]).padStart(2, "0");
  const mm = String(m[3] ?? "00").padStart(2, "0");
  return `UTC${sign}${hh}:${mm}`;
};

const extraerFlags = (it) => {
  const svg = pickString(it?.flags?.svg);
  const png = pickString(it?.flags?.png);
  return {
    ...(svg ? { svg } : {}),
    ...(png ? { png } : {}),
  };
};

const normalize = (it) => {
  const nameOfficial = extraerNombre(it);
  const capital = extraerCapital(it);
  const borders = extraerBorders(it);
  const areaNum = Number(it?.area);
  const popNum = Number(it?.population);
  const gini = extraerGini(it);
  const timezones = normalizarTimezone(it?.timezones);
  const flags = extraerFlags(it);

  const doc = {
    name: { official: nameOfficial },
    capital,
    borders,
    timezones,
    flags,
    creador: process.env.CREATOR_NAME || "Seeder",
  };

  if (Number.isFinite(areaNum) && areaNum > 0) doc.area = areaNum;
  if (Number.isInteger(popNum) && popNum > 0) doc.population = popNum;
  if (gini !== undefined) doc.gini = gini;

  return doc;
};

export const syncCountries = async () => {
  console.log("⬇️  [SEED] Descargando países…");
  let data;
  try {
    const resp = await axios.get(URL, { timeout: 30000 });
    data = resp.data;
    if (!Array.isArray(data)) throw new Error("La API no devolvió un array");
    console.log("✅ [SEED] Descarga OK. Registros:", data.length);
  } catch (err) {
    console.error("💥 [SEED] Error al descargar:", err?.message || err);
    throw err;
  }

  const soloEspanol = data.filter(tieneEspanol);
  console.log(`ℹ️  [SEED] total: ${data.length} | con español: ${soloEspanol.length}`);

  let ok = 0;
  let skipped = 0;

  for (const item of soloEspanol) {
    const doc = normalize(item);

    try {
      await new Country(doc).validate(); // Validación completa
    } catch (e) {
      console.warn(`⚠️  [SEED] Validación fallida para ${doc?.name?.official}:`, e.message);
      skipped++;
      continue;
    }

    try {
      await Country.replaceOne(
        { "name.official": doc.name.official },
        { ...doc, updatedAt: new Date(), createdAt: new Date() },
        { upsert: true }
      );
      ok++;
    } catch (e) {
      console.warn(`⚠️  [SEED] Falló replaceOne "${doc?.name?.official}":`, e?.message || e);
      skipped++;
    }
  }

  console.log(`🏁 [SEED] upserts: ${ok} | saltados: ${skipped}`);
  return { ok, skipped, totalFiltrados: soloEspanol.length };
};

if (IS_CLI) {
  (async () => {
    try {
      await conectarDB();
      console.log("🔌 [SEED] DB conectada. Ejecutando syncCountries()…");
      const res = await syncCountries();
      console.log("✅ [SEED] Finalizado:", res);
    } catch (err) {
      console.error("❌ [SEED] Error general:", err?.message || err);
      process.exitCode = 1;
    } finally {
      try {
        await mongoose.connection.close();
        console.log("🔒 [SEED] Conexión a DB cerrada.");
      } catch {
        // ignore
      }
    }
  })();
} else {
  console.log("ℹ️  [SEED] Importado como módulo (no CLI). No ejecuto seed automático.");
}
