import "dotenv/config";
import mongoose from "mongoose";
import { conectarDB } from "../config/dbConfig.mjs";
import { Country } from "../models/country.mjs";
import { syncCountries } from "./seedCountries.mjs";

const IS_CLI = process.env.npm_lifecycle_event === "reset:countries";

const resetear = async () => {
  try {
    await conectarDB();
    console.log("🔌 [RESET] Conectado a MongoDB");

    const count = await Country.countDocuments({ tipo: 'pais' });
    if (count > 0) {
      console.log("🧹 [RESET] Eliminando", count, "documentos de tipo 'pais'...");
      await Country.deleteMany({ tipo: 'pais' });
      console.log("🗑️ [RESET] Documentos de tipo 'pais' eliminados.");
    } else {
      console.log("🧹 [RESET] No se encontraron documentos de tipo 'pais' para eliminar.");
    }

    console.log("🔄 [RESET] Reseteando países desde API externa...");
    const resultado = await syncCountries();
    console.log("✅ [RESET] Finalizado con éxito:", resultado);
  } catch (error) {
    console.error("❌ [RESET] Error al resetear:", error.message);
  } finally {
    if (IS_CLI) {
      await mongoose.connection.close();
      console.log("🔒 [RESET] Conexión cerrada (CLI).");
    } else {
      console.log("🔒 [RESET] Conexión mantenida (embebido en servidor).");
    }
  }
};

if (IS_CLI) {
  resetear();
}

export default resetear;