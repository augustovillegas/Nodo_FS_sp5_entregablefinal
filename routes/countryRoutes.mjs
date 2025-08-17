import express from "express";
import {
  crearPaisController,
  actualizarPaisController,
  eliminarPaisController,
  eliminarPaisPorNombreOficialController,
  formularioAgregarPaisController,
  formularioEditarPaisController,
  obtenerTodosLosPaisesController,
  exportarCsvController
} from "../controllers/countriesController.mjs";
import { validationRules } from "../middlewares/validationRules.mjs";
import { handleErrors } from "../middlewares/handleErros.mjs";

const router = express.Router();

// Listar todos los países
router.get("/countries", obtenerTodosLosPaisesController);

// Mostrar formulario de carga
router.get("/countries/agregar", formularioAgregarPaisController);

// Procesar creación
router.post("/countries/agregar", validationRules, handleErrors(), crearPaisController);

// Mostrar formulario de edición
router.get("/countries/:id/editar", formularioEditarPaisController);

// Procesar actualización
router.put("/countries/:id/editar", validationRules, handleErrors(), actualizarPaisController);

// Eliminar por ID
router.delete("/countries/:id", eliminarPaisController);

// Eliminar por nombre oficial
router.delete("/countries/nombre/:nombreOficial", eliminarPaisPorNombreOficialController);

// Exportar listado CSV
router.get("/countries/export/csv", exportarCsvController);


export default router;
