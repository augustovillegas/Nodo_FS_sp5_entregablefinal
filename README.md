# 🌎 Panel de Administración de Países de América

Este proyecto forma parte del **Quinto y último Sprint de la Diplomatura en Diseño Web Full Stack con JavaScript (UNCA)** y representa el **entregable final del módulo 4 (Node.js)**.

Una aplicación full stack desarrollada desde cero que permite administrar información de países del continente americano con una arquitectura escalable, validaciones robustas y un diseño moderno, responsivo y centrado en la experiencia del usuario.

---

## 🎯 Objetivos del Proyecto

- Construir un **CRUD completo** de países de América.
- Aplicar arquitectura MVC, patrones de validación y modularización.
- Validar inputs en backend y frontend, incluyendo expresiones regulares y filtros de lenguaje ofensivo.
- Conectar a una API pública (RESTCountries) para importar datos reales.
- Implementar tests automáticos con Vitest y Supertest.
- Utilizar EJS + TailwindCSS para renderizar vistas limpias, rápidas y responsivas.

---

## 🧱 Estructura del Proyecto

```
📁 config/
   └─ dbConfig.mjs              # Conexión a MongoDB
📁 controllers/
   └─ countriesController.mjs   # Lógica de negocio
📁 helpers/
   └─ badWordsHelper.mjs        # Filtrado de palabras prohibidas
📁 middlewares/
   └─ handleErros.mjs           # Middleware centralizado de errores
📁 models/
   └─ country.mjs               # Modelo Country de MongoDB
📁 public/
   ├─ icons/                    # Íconos SVG usados en el dashboard
   ├─ img/                      # Imagen QR y fondo
   └─ js/                       # JS para validación, paginación, modales
📁 routes/
   └─ countryRoutes.mjs         # Rutas del CRUD
📁 scripts/
   ├─ seedCountries.mjs         # Inicializa DB desde RESTCountries API
   └─ resetCountries.mjs        # Restaura estado cada 20 min (cron)
📁 tests/
   └─ countries.validation.test.js # Tests Vitest + Supertest
📁 views/
   ├─ dashboard.ejs             # Listado de países + buscador y paginación
   ├─ addCountry.ejs            # Formulario de alta
   ├─ editCountry.ejs           # Edición de países existentes
   ├─ informacion.ejs           # Información general del proyecto
   └─ partials/                 # Includes reutilizables (modales, alertas)
📄 server.mjs                   # Server principal Express + configuración
📄 package.json                # Dependencias y scripts
```

---

## ⚙️ Tecnologías Utilizadas

### Backend
- [Node.js](https://nodejs.org/) (v18+)
- [Express.js](https://expressjs.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Mongoose](https://mongoosejs.com/)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [node-cron](https://www.npmjs.com/package/node-cron)

### Frontend
- [EJS](https://ejs.co/) (motor de plantillas)
- [Tailwind CSS](https://tailwindcss.com/) (estilado)
- JS Vanilla para validaciones y paginación

### Utilidades y Testing
- [express-validator](https://express-validator.github.io/docs/)
- [axios](https://axios-http.com/)
- [json2csv](https://www.npmjs.com/package/json2csv)
- [Vitest](https://vitest.dev/) + [Supertest](https://www.npmjs.com/package/supertest)

---

## 🚀 Instalación y Puesta en Marcha

### 1. Clonar repositorio
```bash
git clone https://github.com/augustovillegas/Nodo_FS_sp5_entregablefinal.git
cd Nodo_FS_sp5_entregablefinal
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar archivo .env
Crear un archivo `.env` en la raíz con las siguientes variables:

```
PORT=3008
MONGODB_URI=<TU_MONGO_ATLAS_URI>
RESTCOUNTRY_URL=https://restcountries.com/v3.1/region/americas
NODE_ENV=development
```

### 4. Inicializar la base de datos (seed)
```bash
npm run seed:countries
```

### 5. Ejecutar servidor
```bash
npm run dev
```
Luego acceder a [http://localhost:3008](http://localhost:3008)

---

## 🧪 Ejecutar Tests

```bash
npm run test
```

Incluye validaciones de reglas backend, estructura de errores y comportamiento esperado de inputs maliciosos.

---

## 📷 Capturas de Pantalla

### Dashboard (CRUD + Buscador + Paginación)
![dashboard](public/img/demo-dashboard.png)

### Formulario de País
![form](public/img/demo-form.png)

### Vista de Información
![info](public/img/demo-info.png)

---

## 📌 Autor

**Augusto Villegas**  
Entregable final de la Diplomatura en Diseño Web Full Stack (UNCA)  
🔗 [GitHub](https://github.com/augustovillegas)

---

## ✨ Comentario Final

Este panel demuestra una aplicación moderna de prácticas full stack con enfoque profesional:

✔️ Modularización clara  
✔️ Validaciones front y back  
✔️ Estilo visual sobrio y responsivo  
✔️ Automatización con cron y pruebas  
✔️ Listo para producción o despliegue serverless

---

🧠 *"Menos ruido visual, más foco en los datos y en la productividad."*