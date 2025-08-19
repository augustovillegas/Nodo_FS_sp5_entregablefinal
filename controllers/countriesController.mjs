import {
  crearPais,
  actualizarPais,
  eliminarPais,
  eliminarPaisPorNombreOficial,
  obtenerPaisPorId,
  obtenerTodosLosPaises,
  generarCsvPaises 
} from "../services/countriesService.mjs";

import { renderizarPais } from "../views/responseView.mjs";

/* ============================================================================
 * LISTAR
 * ==========================================================================*/
export const obtenerTodosLosPaisesController = async (req, res) => {
  console.log("📥 GET /api/countries - Obtener todos los países");
  try {
    const countries = await obtenerTodosLosPaises();
    console.log("✅ Países obtenidos:", countries.length);

    if (req.accepts("html")) {
      // Pasamos 'errors' vacío por defecto. 'old' no es necesario aquí.
      return res.render("dashboard", { title: "Panel de control", countries, errors: [] });
    }

    if (req.accepts("json")) {
      return res.status(200).json({
        mensaje: "Lista de países",
        total: countries.length,
        data: countries.map(renderizarPais),
      });
    }

    return res.status(406).send("Not Acceptable: Solo HTML o JSON.");
  } catch (error) {
    console.error("❌ Error al obtener países:", error);
    return res.status(500).render("dashboard", {
      countries: [],
      errors: [{ msg: "Error al cargar los países: " + error.message }],
      old: {}
    });
  }
};

/* ============================================================================
 * FORM AGREGAR
 * ==========================================================================*/
export const formularioAgregarPaisController = (req, res) => {
  console.log("📥 GET /api/countries/agregar - Formulario agregar");
  return res.render("addCountry", { title: "Agregar nuevo", errors: [], old: {} });
};

/* ============================================================================
 * CREAR
 * ==========================================================================*/
export const crearPaisController = async (req, res) => {
  const old = { ...req.body };
  console.log("📤 POST /api/countries/agregar - Body recibido:", old);

  try {
    const nuevo = await crearPais(req.body);
    console.log("✅ País creado:", nuevo);

    if (req.accepts("html")) {
      return res.redirect("/api/countries");
    }

    if (req.accepts("json")) {
      return res.status(201).json({
        mensaje: "País creado con éxito.",
        data: renderizarPais(nuevo),
      });
    }

    return res.status(406).send("Not Acceptable");
  } catch (error) {
    console.error("❌ Error al crear país:", error);

    if (req.accepts("json")) {      
      return res.status(400).json({
        mensaje: "Error al crear país",
        error: error.message,
        old,
        errors: [
          {
            msg: error?.message || "Error inesperado",
            param: "general",
          },
        ],
      });
    }

    return res.status(500).render("addCountry", {
      errors: [{ msg: error.message }],
      old
    });
  }
};


/* ============================================================================
 * FORM EDITAR
 * ==========================================================================*/
export const formularioEditarPaisController = async (req, res) => {
  console.log(`📥 GET /api/countries/${req.params.id}/editar - Formulario editar`);

  try {
    const country = await obtenerPaisPorId(req.params.id);

    if (!country) {
      return res.status(404).render("dashboard", {
        countries: await obtenerTodosLosPaises(),
        errors: [{ msg: "País no encontrado para editar." }],
        old: {}
      });
    }
    
    return res.render("editCountry", {
      errors: [],
      old: {},
      country,
      countryId: country._id
    });
  } catch (error) {
    console.error("❌ Error al cargar edición:", error);
    return res.status(500).render("dashboard", {
      countries: await obtenerTodosLosPaises(),
      errors: [{ msg: "Error al buscar país: " + error.message }],
      old: {}
    });
  }
};

/* ============================================================================
 * ACTUALIZAR
 * ==========================================================================*/
export const actualizarPaisController = async (req, res) => {
  const id = req.params.id;
  const old = { ...req.body, _id: id };

  console.log(`📝 PUT /api/countries/${id}/editar - Datos recibidos`, req.body);

  try {
    const actualizado = await actualizarPais(id, req.body);

    if (!actualizado) {
      const mensaje = "País no encontrado para actualizar.";

      if (req.accepts("json")) {
        return res.status(404).json({ mensaje, id });
      }

      return res.status(404).render("editCountry", {
        errors: [{ msg: mensaje }],
        old,
        countryId: id
      });
    }

    console.log("✅ País actualizado:", actualizado);

    if (req.accepts("html")) {
      return res.redirect("/api/countries");
    }

    if (req.accepts("json")) {
      return res.status(200).json({
        mensaje: "Actualización exitosa.",
        data: renderizarPais(actualizado),
      });
    }

    return res.status(406).send("Not Acceptable.");
  } catch (error) {
    console.error("❌ Error al actualizar:", error);

    if (req.accepts("json")) {
      return res.status(400).json({
        mensaje: "Error al actualizar",
        error: error.message,
      });
    }

    return res.status(400).render("editCountry", {
      errors: [{ msg: error.message }],
      old,
      countryId: id
    });
  }
};

/* ============================================================================
 * ELIMINAR POR ID
 * ==========================================================================*/
export const eliminarPaisController = async (req, res) => {
  const id = req.params.id;
  console.log(`🗑️ DELETE /api/countries/${id} - Eliminar país`);

  try {
    const eliminado = await eliminarPais(id);

    if (!eliminado) {
      console.warn("⚠️ País no encontrado para eliminar");

      if (req.accepts("html")) {
        const countries = await obtenerTodosLosPaises();
        return res.status(404).render("dashboard", {
          countries,
          errors: [{ msg: "País no encontrado para eliminar." }],
          old: {}
        });
      }

      if (req.accepts("json")) {
        return res.status(404).json({ mensaje: "País no encontrado." });
      }

      return res.status(406).send("Not Acceptable");
    }

    console.log("✅ Eliminado correctamente:", eliminado);

    if (req.accepts("html")) {
      return res.redirect("/api/countries");
    }

    if (req.accepts("json")) {
      return res.status(200).json({
        mensaje: "País eliminado correctamente.",
        data: renderizarPais(eliminado),
      });
    }

    return res.status(406).send("Not Acceptable");
  } catch (error) {
    console.error("❌ Error al eliminar:", error);

    if (req.accepts("html")) {
      const countries = await obtenerTodosLosPaises();
      return res.status(500).render("dashboard", {
        countries,
        errors: [{ msg: "Error al eliminar país: " + error.message }],
        old: {}
      });
    }

    if (req.accepts("json")) {
      return res.status(500).json({
        mensaje: "Error al eliminar país",
        error: error.message
      });
    }

    return res.status(406).send("Not Acceptable");
  }
};

/* ============================================================================
 * ELIMINAR POR NOMBRE OFICIAL
 * ==========================================================================*/
export const eliminarPaisPorNombreOficialController = async (req, res) => {
  const nombre = req.params.nombreOficial;
  console.log(`🗑️ DELETE /api/countries/nombre/${nombre} - Eliminar por nombre oficial`);

  try {
    const eliminado = await eliminarPaisPorNombreOficial(nombre);

    if (!eliminado) {
      return res.status(404).json({ mensaje: "No encontrado por nombre oficial" });
    }

    return res.status(200).json({
      mensaje: "Eliminado correctamente",
      data: renderizarPais(eliminado),
    });
  } catch (error) {
    console.error("❌ Error al eliminar por nombre:", error);
    return res.status(500).json({
      mensaje: "Error al eliminar por nombre",
      error: error.message,
    });
  }
};

/* ============================================================================
 * EXPORTAR CSV
 * ==========================================================================*/
export const exportarCsvController = async (_req, res) => {
  try {
    const csv = await generarCsvPaises();
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=LiastoDePaises.csv");
    res.status(200).send(csv);
  } catch (error) {
    console.error("❌ Error al exportar CSV:", error.message);
    res.status(500).json({ mensaje: "Error al generar CSV", error: error.message });
  }
};
