import countryRepository from "../repository/countryRepository.mjs";
import { Parser } from "json2csv";

// Normaliza el campo name si viene como string plano
const normalizarNombre = (data) => {
  if (typeof data?.name === "string") {
    data.name = { official: data.name.trim() };
  }
  return data;
};

export const obtenerTodosLosPaises = async () => {
  console.log("🧠 [SRV] obtenerTodosLosPaises()");
  return await countryRepository.obtenerTodos();
};

export const obtenerPaisPorId = async (id) => {
  console.log("🧠 [SRV] obtenerPaisPorId()", id);
  return await countryRepository.obtenerPorId(id);
};

export const obtenerPaisPorNombreOficial = async (nombreOficial) => {
  console.log("🧠 [SRV] obtenerPaisPorNombreOficial()", nombreOficial);
  return await countryRepository.obtenerPorNombreOficial(nombreOficial);
};

export const crearPais = async (data) => {
  const normalizado = normalizarNombre(data);
  console.log("🧠 [SRV] crearPais() con:", normalizado?.name?.official);
  return await countryRepository.crear(normalizado);
};

export const actualizarPais = async (id, data) => {
  const normalizado = normalizarNombre(data);
  console.log("🧠 [SRV] actualizarPais() con:", normalizado?.name?.official);
  return await countryRepository.actualizar(id, normalizado);
};

export const eliminarPais = async (id) => {
  console.log("🧠 [SRV] eliminarPais()", id);
  return await countryRepository.eliminar(id);
};

export const eliminarPaisPorNombreOficial = async (nombreOficial) => {
  console.log("🧠 [SRV] eliminarPaisPorNombreOficial()", nombreOficial);
  return await countryRepository.eliminarPorNombreOficial(nombreOficial);
};

export const generarCsvPaises = async () => {  
  const ListadoDePaises = await obtenerTodosLosPaises();
   console.log(`🧠 [SRV] generarCsvPaises() - Generando CSV con ${ListadoDePaises.length} Paises...`);
  const campos = ["name.official", "capital", "area", "population", "gini", "timezones", "creador"];
  const parser = new Parser({ fields: campos });
  return parser.parse(ListadoDePaises);
};