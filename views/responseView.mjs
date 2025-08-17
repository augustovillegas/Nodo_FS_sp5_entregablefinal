export function renderizarPais(pais) {
  if (!pais) return null;

  return {
    id: String(pais._id ?? pais.id ?? ""),
    name: { official: pais?.name?.official ?? "" },

    // En el modelo "capital" es String, la exponemos como String
    capital: pais?.capital ?? "Sin Registro",

    // En el modelo "borders" es Array<String>
    borders: Array.isArray(pais?.borders) ? pais.borders : [],

    area: pais?.area ?? null,
    population: pais?.population ?? null,
    gini: pais?.gini ?? null,

    // timezones es String con formato tipo "UTC-03:00"
    timezones: pais?.timezones ?? "",

    // flags es un objeto con posibles svg/png (solo incluimos las que existan)
    flags: {
      ...(pais?.flags?.svg ? { svg: pais.flags.svg } : {}),
      ...(pais?.flags?.png ? { png: pais.flags.png } : {}),
    },

    creador: pais?.creador ?? "",
    createdAt: pais?.createdAt ?? null,
    updatedAt: pais?.updatedAt ?? null,
  };
}

export function renderizarPaises(lista = []) {
  return Array.isArray(lista) ? lista.map(renderizarPais) : [];
}
