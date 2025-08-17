
import mongoose from "mongoose";

const mask = (uri = "") => {
  if (!uri) return "";
  // Oculta credenciales en logs
  return uri.replace(/\/\/([^@]+)@/, "//***:***@");
};

export const conectarDB = async () => {
  const uri = process.env.MONGO_URL;
  console.log("🔌 [DB] Intentando conectar a MongoDB…", mask(uri));

  if (!uri) {
    console.error("❌ [DB] MONGO_URL no configurado en .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, {      
      autoIndex: true,
      serverSelectionTimeoutMS: 15000,
    });
    console.log("✅ [DB] Conexión exitosa a MongoDB");
  } catch (error) {
    console.error("❌ [DB] Error al conectar a MongoDB:", error.message);
    process.exit(1);
  }
};
