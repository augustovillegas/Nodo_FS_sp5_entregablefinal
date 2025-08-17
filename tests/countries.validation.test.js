// countries.validation.test.js
import { describe, expect, it, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../server.mjs";
import resetCountries from "../scripts/resetCountries.mjs";
import mongoose from "mongoose";
import { renderizarPais } from "../views/responseView.mjs";

const generarNombreUnico = () => {
  const letras = "abcdefghijklmnopqrstuvwxyz";
  const random = () => Array.from({ length: 6 }, () => letras[Math.floor(Math.random() * letras.length)]).join("");
  return `Testlandia-${random().toUpperCase()}`;
};

let nombreOficial = generarNombreUnico();
let idCreado = null;

beforeAll(async () => {
  await resetCountries();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("✅ API de Países - Test Exhaustivo y Validación Profunda", () => {
  const datosValidos = {
    name: { official: nombreOficial },
    capital: "Testópolis",
    borders: ["ARG", "CHL"],
    area: 12345.67,
    population: 7890123,
    gini: 45.6,
    timezones: "UTC-03:00",
    flags: {
      svg: "https://test.com/bandera.svg",
      png: "https://test.com/bandera.png"
    },
    creador: "Tester Profesional"
  };

  const endpoint = "/api/countries/agregar";

  const testInvalido = async (campo, payloadMod, mensajeEsperado) => {
    const payload = { ...datosValidos, ...payloadMod };
    const res = await request(app)
      .post(endpoint)
      .set("Accept", "application/json")
      .send(payload);

    if (res.statusCode === 201) {
      console.warn(`⚠️  TEST FALLIDO: '${campo}' fue aceptado cuando no debería.`);
      console.log("Respuesta:", res.body);
    }

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
    if (mensajeEsperado) {
        expect(res.body.errors[0].msg).toBe(mensajeEsperado);
    } else {
        expect(res.body.errors.some(e => e.path?.includes(campo))).toBe(true);
    }
  };

  describe("❌ Validaciones individuales", () => {
    it("❌ name.official vacío", () => testInvalido("name.official", { name: { official: "" } }));
    it("❌ name.official con números", () => testInvalido("name.official", { name: { official: "País 123" } }));
    it("❌ name.official con emojis", () => testInvalido("name.official", { name: { official: "🌎 País" } }));
    it("❌ name.official con malas palabras", () => 
      testInvalido("name.official", { name: { official: "País-pendejo" } }, "El nombre oficial contiene palabras no permitidas.")
    );

    it("❌ capital vacía", () => testInvalido("capital", { capital: "" }));
    it("❌ capital con números", () => testInvalido("capital", { capital: "Capital123" }));
    it("❌ capital con emojis", () => testInvalido("capital", { capital: "Ciudad 🌆" }));
    it("❌ capital con malas palabras", () => 
      testInvalido("capital", { capital: "Capital-puto" }, "La capital contiene palabras no permitidas.")
    );

    it("❌ borders con código inválido", () => testInvalido("borders", { borders: ["ARG", "xx", "123"] }));
    it("❌ borders con duplicados", () => testInvalido("borders", { borders: ["ARG", "ARG", "CHL"] }));

    it("❌ area negativa", () => testInvalido("area", { area: -100 }));
    it("❌ area como texto", () => testInvalido("area", { area: "mucho" }));
    it("❌ area con emojis", () => testInvalido("area", { area: "1000🌍" }));

    it("❌ population negativa", () => testInvalido("population", { population: -500 }));
    it("❌ population decimal", () => testInvalido("population", { population: 1234.56 }));
    it("❌ population como string", () => testInvalido("population", { population: "millones" }));
    it("❌ population con emojis", () => testInvalido("population", { population: "1000👥" }));

    it("❌ gini menor a 0", () => testInvalido("gini", { gini: -1 }));
    it("❌ gini mayor a 100", () => testInvalido("gini", { gini: 150 }));
    it("❌ gini con texto", () => testInvalido("gini", { gini: "equilibrado" }));
    it("❌ gini con emojis", () => testInvalido("gini", { gini: "50🧮" }));

    it("❌ timezones con formato inválido", () => testInvalido("timezones", { timezones: "GMT-3" }));
    it("❌ timezones vacío", () => testInvalido("timezones", { timezones: "" }));

    it("❌ flags.svg inválido", () => testInvalido("flags.svg", { flags: { ...datosValidos.flags, svg: "ftp://no-url" } }));
    it("❌ flags.png inválido", () => testInvalido("flags.png", { flags: { ...datosValidos.flags, png: "no-es-url" } }));

    it("❌ creador vacío", () => testInvalido("creador", { creador: "" }));
    it("❌ creador con números", () => testInvalido("creador", { creador: "Leo123" }));
    it("❌ creador con emojis", () => testInvalido("creador", { creador: "Augusto 👨‍💻" }));
    it("❌ creador con malas palabras", () => 
      testInvalido("creador", { creador: "creador-boludo" }, "El creador contiene palabras no permitidas.")
    );
  });

  describe("✅ Operaciones válidas", () => {
    it("✅ Crear país válido", async () => {
      const res = await request(app)
        .post(endpoint)
        .set("Accept", "application/json")
        .send(datosValidos);

      expect(res.statusCode).toBe(201);

      const nuevo = res.body?.data;

      if (!nuevo || !nuevo.id) {
        throw new Error(`❌ No se recibió el país creado correctamente. Respuesta: ${JSON.stringify(res.body)}`);
      }

      expect(nuevo).toHaveProperty("id");

      const renderizado = renderizarPais(nuevo);
      expect(renderizado.name.official).toBe(nombreOficial);
      expect(renderizado.capital).toBe(datosValidos.capital);
      expect(renderizado.creador).toBe(datosValidos.creador);

      idCreado = nuevo.id;
    });

    it("✅ Eliminar país por ID", async () => {
      expect(idCreado).toBeDefined();

      const res = await request(app)
        .delete(`/api/countries/${idCreado}`)
        .set("Accept", "application/json");

      expect(res.statusCode).toBe(200);
      expect(res.body.mensaje).toBe("País eliminado correctamente.");
    });
  });
});