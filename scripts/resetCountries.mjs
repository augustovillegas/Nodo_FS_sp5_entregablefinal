import "dotenv/config";
import mongoose from "mongoose";
import { conectarDB } from "../config/dbConfig.mjs";
import { Country } from "../models/country.mjs";
import { syncCountries } from "./seedCountries.mjs";

// 🆕 CAMBIO PEQUEÑO: detectar si se ejecuta como CLI (npm run reset:countries)
const IS_CLI = process.env.npm_lifecycle_event === "reset:countries";

const resetear = async () => {
  try {
    await conectarDB();
    console.log("🔌 [RESET] Conectado a MongoDB");

    const count = await Country.countDocuments();
    if (count > 0) {
      console.log("🧹 [RESET] Eliminando", count, "documentos...");
      await Country.deleteMany({});
      console.log("🗑️ [RESET] Base de datos limpia.");
    }

    console.log("🔄 [RESET] Reseteando países desde API externa...");
    const resultado = await syncCountries();
    console.log("✅ [RESET] Finalizado con éxito:", resultado);
  } catch (error) {
    console.error("❌ [RESET] Error al resetear:", error.message);
  } finally {
    // 🆕 CAMBIO PEQUEÑO: cerrar conexión SOLO si corre como CLI
    if (IS_CLI) {
      await mongoose.connection.close();
      console.log("🔒 [RESET] Conexión cerrada (CLI).");
    } else {
      console.log("🔒 [RESET] Conexión mantenida (embebido en servidor).");
    }
  }
};

// Si se ejecuta como CLI
if (IS_CLI) {
  resetear();
}

// También exportable para importar desde cron
export default resetear;