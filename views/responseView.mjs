export function renderizarPais(pais) {
  if (!pais) return null;

  return {
    id: String(pais._id ?? pais.id ?? ""),
    name: {
      official: pais?.name?.official ?? ""
    },
    capital: pais?.capital ?? "Sin Registro",
    borders: Array.isArray(pais?.borders) ? pais.borders : [],
    area: typeof pais?.area === "number" ? pais.area : null,
    population: typeof pais?.population === "number" ? pais.population : null,
    gini: typeof pais?.gini === "number" ? pais.gini : null,
    timezones: pais?.timezones ?? "",
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
