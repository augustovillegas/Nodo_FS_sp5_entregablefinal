import countryRepository from "../repository/countryRepository.mjs";
import { Parser } from "json2csv";

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
  console.log("🧠 [SRV] crearPais() con:", data?.name?.official);
  const paisExistente = await countryRepository.obtenerPorNombreOficial(data.name.official);
  if (paisExistente) {
    throw new Error("El país ingresado ya existe.");
  }
  return await countryRepository.crear(data);
};

export const actualizarPais = async (id, data) => {  
  console.log("🧠 [SRV] actualizarPais() con:", data?.name?.official);
  const paisExistente = await countryRepository.obtenerPorNombreOficial(data.name.official);  
  if (paisExistente && String(paisExistente._id) !== String(id)) {
    throw new Error("El nombre oficial ya existe en otro país.");
  }
  return await countryRepository.actualizar(id, data);
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