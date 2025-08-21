import { body } from "express-validator";
import { hasBadWords } from "../herlpers/badWordsHelper.mjs";

// Expresión regular para detectar emojis
const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E6}-\u{1F1FF}]/u;

// Expresión regular que permite solo letras y espacios
const lettersAndSpacesRegex = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/;

console.log("⚙️ [VALID] Middleware de validación cargado.");

/**
 * Middleware de validación para crear o actualizar países
 */
export const validationRules = [  

  body("name.official")  
    .notEmpty()    
    .withMessage("El campo nombre oficial es obligatorio.")
    .bail()
    .isLength({ min: 3, max: 90 })
    .withMessage("nombre oficial debe tener entre 3 y 90 caracteres. Ej: República Argentina")
    .bail()
    .custom((value) => lettersAndSpacesRegex.test(value))
    .withMessage("El Nombre oficial solo puede contener letras y espacios.")
    .bail()
    .custom((value) => !emojiRegex.test(value))
    .withMessage("El nombre oficial no puede contener emoticones.")
    .bail()
    .custom(hasBadWords)
    .withMessage("El nombre oficial contiene palabras no permitidas."),

  body("capital")
    .notEmpty()
    .withMessage("El campo capital es obligatorio.")
    .bail()
    .isLength({ min: 3, max: 90 })
    .withMessage("capital debe tener entre 3 y 90 caracteres. Ej: Buenos Aires")
    .bail()
    .custom((value) => lettersAndSpacesRegex.test(value))
    .withMessage("La capital solo puede contener letras y espacios.")
    .bail()
    .custom((value) => !emojiRegex.test(value))
    .withMessage("La capital no puede contener emoticones.")
    .bail()
    .custom(hasBadWords)
    .withMessage("La capital contiene palabras no permitidas."),

  body("borders")
    .customSanitizer((value) => (value === "" ? undefined : value))
    .optional({ nullable: true })
    .custom((value) => !emojiRegex.test(value))
    .withMessage("La/s frontera/s no puede contener emoticones.")
    .custom(hasBadWords)
    .withMessage("La/s frontera/s contiene palabras no permitidas.")
    .custom((value) => {
      const list = Array.isArray(value)
        ? value
        : typeof value === "string"
        ? value.split(",")
        : [];

      const codes = list
        .map((s) => String(s).trim().toUpperCase())
        .filter(Boolean);

      const hasInvalidFormat = codes.some((code) => !/^[A-Z]{3}$/.test(code));
      const hasDuplicates = new Set(codes).size !== codes.length;

      if (hasInvalidFormat)
        throw new Error(
          "Cada frontera debe ser un código CCA3 (3 letras mayúsculas). Ej: ARG, BRA"
        );
      if (hasDuplicates)
        throw new Error(
          "El campo fronteras no debe contener duplicados. Ej: ARG, ARG"
        );

      return true;
    }),

  body("area")
    .notEmpty()
    .withMessage("El área es obligatoria.")
    .bail()
    .isFloat({ gt: 0 })
    .withMessage("El área debe ser un número positivo (> 0). Ej: 457800")
    .bail()
    .custom((value) => /^[0-9]+(\.[0-9]+)?$/.test(value))
    .withMessage("El área no debe contener letras ni símbolos.")
    .bail()
    .custom((value) => !emojiRegex.test(String(value)))
    .withMessage("El área no puede contener emoticones."),

  body("population")
    .notEmpty()
    .withMessage("La población es obligatoria.")
    .bail()
    .isInt({ gt: 0 })
    .withMessage("La población debe ser un entero positivo. Ej: 457800")
    .bail()
    .custom((value) => /^[0-9]+$/.test(value))
    .withMessage("La población no debe contener letras ni símbolos.")
    .bail()
    .custom((value) => !emojiRegex.test(String(value)))
    .withMessage("La población no puede contener emoticones."),

  body("gini")
    .customSanitizer((value) => (value === "" ? undefined : value))
    .optional({ nullable: true })
    .isFloat({ min: 0, max: 100 })
    .withMessage("El campo gini debe estar entre 0 y 100. Ej: 82.1")
    .bail()
    .custom((value) => /^[0-9]+(\.[0-9]+)?$/.test(value))
    .withMessage("El campo gini no debe contener letras ni símbolos.")
    .bail()
    .custom((value) => !emojiRegex.test(String(value)))
    .withMessage("El campo gini no puede contener emoticones."),

  body("timezones")
    .notEmpty()
    .withMessage("El campo timezone es obligatorio.")
    .bail()
    .matches(/^UTC[+-][0-1][0-9]:[0-5][0-9]$/)
    .withMessage("timezones debe tener el formato UTC±HH:MM (ej: UTC-03:00)"),

  body("flags.svg")
    .optional({ nullable: true })
    .custom((value) => value === "" || /^https?:\/\/.+/.test(value))
    .withMessage("flags.svg debe ser una URL válida (http o https)"),

  body("flags.png")
    .optional({ nullable: true })
    .custom((value) => value === "" || /^https?:\/\/.+/.test(value))
    .withMessage("flags.png debe ser una URL válida (http o https)"),

  body("creador")
    .notEmpty()
    .withMessage("El campo creador es obligatorio.")
    .bail()
    .isLength({ min: 3, max: 90 })
    .withMessage(
      "El creador debe tener entre 3 y 90 caracteres. Ej: Juan Pérez"
    )
    .bail()
    .custom((value) => lettersAndSpacesRegex.test(value))
    .withMessage(
      "El creador solo puede contener letras y espacios. Ej: Juan Pérez"
    )
    .bail()
    .custom((value) => !emojiRegex.test(value))
    .withMessage("El creador no puede contener emoticones.")
    .bail()
    .custom(hasBadWords)
    .withMessage("El creador contiene palabras no permitidas."),
];
