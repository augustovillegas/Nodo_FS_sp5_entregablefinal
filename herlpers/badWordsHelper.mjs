import { Filter } from 'bad-words'
import dotenv from "dotenv";

dotenv.config();

// 1. Lee la variable de entorno y crea un array de palabras.
const customBadWordsString = process.env.BAD_WORDS || "";
const customBadWords = customBadWordsString
  .split(',')
  .map(word => word.trim())
  .filter(word => word.length > 0);

// 2. Inicializa el filtro.
const filter = new Filter();

// 3. Agrega las palabras personalizadas a la lista del filtro.
if (customBadWords.length > 0) {
  filter.addWords(...customBadWords);
}

/**
 * Validador personalizado para express-validator.
 * Comprueba si un valor de texto contiene alguna palabra de la lista de la biblioteca.
 * @param {string} value - El valor del campo a validar.
 */
export const hasBadWords = (value) => {
  if (typeof value !== 'string') {
    return true; 
  }
  
  if (filter.isProfane(value)) {
    throw new Error("El campo contiene palabras no permitidas.");
  }
  return true;
};