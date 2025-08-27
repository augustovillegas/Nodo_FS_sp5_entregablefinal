import mongoose from "mongoose";

const countrySchema = new mongoose.Schema(
  {    
    tipo: {
      type: String,
      default: "pais",
      enum: ["pais"],
      required: true 
    },

    // name.official: String (3-90) único
    name: {
      official: {
        type: String,
        required: [true, "El campo name.official es obligatorio"],
        minlength: [3, "name.official debe tener al menos 3 caracteres"],
        maxlength: [90, "name.official debe tener como máximo 90 caracteres"],
        trim: true,
        unique: true,
        index: true,
      },
    },

    // capital: String (cada ítem 3-90)
    capital: {
      type: String,
      default: "Sin Registro",
      required: [true, "El campo capital es obligatorio"],
      minlength: [3, "capital debe tener al menos 3 caracteres"],
      maxlength: [90, "capital debe tener como máximo 90 caracteres"],
      trim: true,
    },

    // borders: Array<String> (cada código 3 letras MAYÚSCULAS, sin duplicados)
    borders: {
      type: [String],
      default: [],
/*
      set: (value) => {
        const list = Array.isArray(value)
          ? value
          : value == null
          ? []
          : [value];
        const normalized = list
          .map((s) =>
            String(s || "")
              .toUpperCase()
              .trim()
          )
          .filter(Boolean);
        return Array.from(new Set(normalized));
      },

      validate: [
        {
          validator: function (arr) {
            return Array.isArray(arr);
          },
          message: "borders debe ser un arreglo de strings",
        },
        {
          validator: function (arr) {
            return arr.every((code) => /^[A-Z]{3}$/.test(code));
          },
          message: "Cada border debe ser un código CCA3 (3 letras mayúsculas)",
        },
        {
          validator: function (arr) {
            return new Set(arr).size === arr.length;
          },
          message: "borders no debe contener duplicados",
        },
      ],
    },*/
    // area: Number (positivo)
},
    area: {
      type: Number,
      required: [true, "El área es obligatoria"],
      validate: {
        validator: (v) => typeof v === "number" && isFinite(v) && v > 0,
        message: "El área debe ser un número positivo (> 0)",
      },
    },

    // population: Number (entero positivo)
    population: {
      type: Number,
      required: [true, "La población es obligatoria"],
      validate: {
        validator: (v) => Number.isInteger(v) && v > 0,
        message: "La población debe ser un entero positivo",
      },
    },

    // gini: Number (0-100) opcional, para totales/promedios en el dashboard
    gini: {
      type: Number,
      min: [0, "gini no puede ser negativo"],
      max: [100, "gini no puede superar 100"],
    },

    // timezones: String con formato "UTC±HH:MM" (ej: UTC-03:00)
    timezones: {
      type: String,
      required: [true, "El campo timezones es obligatorio"],
      set: (value) => {
        if (value == null) return "";
        let s = String(Array.isArray(value) ? value[0] : value).trim(); // si viene array, tomo el 1ro
        // normalizo: signo unicode → '-', agrego prefijo UTC si falta, y pad HH:MM
        s = s.replace(/\u2212/g, "-").toUpperCase();
        if (!s.startsWith("UTC")) {
          if (s.startsWith("+") || s.startsWith("-")) s = "UTC" + s;
          else if (s === "UTC") s = "UTC+00:00";
        }
        const m = s.match(/^UTC(?:\s*)?([+-])\s*(\d{1,2})(?::?(\d{2}))?$/);
        if (!m) return /^UTC[+-]\d{2}:\d{2}$/.test(s) ? s : s; // dejo como vino; la validación se encarga
        const sign = m[1];
        const hh = String(m[2]).padStart(2, "0");
        const mm = String(m[3] ?? "00").padStart(2, "0");
        return `UTC${sign}${hh}:${mm}`;
      },
      validate: {
        validator: (tz) =>
          typeof tz === "string" && /^UTC[+-]\d{2}:\d{2}$/.test(tz),
        message: "timezones debe tener el formato UTC±HH:MM (ej: UTC-03:00)",
      },
    },

    // flags: prioridad svg (png opcional por compatibilidad)
    flags: {
      svg: {
        type: String,
        trim: true,
        default: "",
        validate: {
          validator: (u) => !u || /^https?:\/\/.+/i.test(u),
          message: "flags.svg debe ser una URL válida (http/https)",
        },
      },
      png: {
        type: String,
        trim: true,
        default: "",
        validate: {
          validator: (u) => !u || /^https?:\/\/.+/i.test(u),
          message: "flags.png debe ser una URL válida (http/https)",
        },
      },
    },
    
    creador: {
      type: String,
      required: [true, "El campo creador es obligatorio"],
      trim: true,
      minlength: [3, "creador debe tener al menos 3 caracteres"],
      maxlength: [90, "creador debe tener como máximo 90 caracteres"],
    },
  },
  {
    timestamps: true,
    collection: "Grupo-03", // Modificar para migrar
    strict: true,
  } 
);

export const Country = mongoose.model("Country", countrySchema);

/*
 timestamps: true,
    collection: "countries", // Modificar para migrar
    strict: true,
*/