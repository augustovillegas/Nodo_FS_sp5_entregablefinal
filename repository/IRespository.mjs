// IRespository.mjs
// Interfaz base para repositorios del proyecto (países).
// Mantiene las firmas que usan los repos concretos: CountryRepository, etc.

class IRepository {
  /**
   * Obtener todos los documentos.
   * @returns {Promise<Array<any>>}
   */
  obtenerTodos() {
    throw new Error("Método 'obtenerTodos()' no implementado");
  }

  /**
   * Obtener un documento por su ID.
   * @param {string} id
   * @returns {Promise<any|null>}
   */
  obtenerPorId(id) { 
    throw new Error("Método 'obtenerPorId(id)' no implementado");
  }

  /**
   * Crear un documento.
   * @param {object} data
   * @returns {Promise<any>}
   */
  crear(data) { 
    throw new Error("Método 'crear(data)' no implementado");
  }

  /**
   * Actualizar un documento por su ID.
   * @param {string} id
   * @param {object} data
   * @returns {Promise<any|null>}
   */
  actualizar(id, data) { 
    throw new Error("Método 'actualizar(id, data)' no implementado");
  }

  /**
   * Eliminar un documento por su ID.
   * @param {string} id
   * @returns {Promise<any|null>}
   */
  eliminar(id) { 
    throw new Error("Método 'eliminar(id)' no implementado");
  } 
}

export { IRepository };
