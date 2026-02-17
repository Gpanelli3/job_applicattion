https://botfilter-h5ddh6dye8exb7ha.centralus-01.azurewebsites.net

Como ejecutar la aplicacion
1) Abrir un servidor estatico en esta carpeta (para evitar problemas de CORS).
2) Abrir apply-jobs.html en el navegador.
3) Ver los logs en la consola del navegador:
  - candidate data (respuesta de Step 2)
  - jobs list (respuesta de Step 3)
  - apply-to-job response (respuesta del submit)

Notas
- Edita CANDIDATE_EMAIL en ApplyJobs.jsx para usar tu email.
- La app usa React via CDN y Babel en el navegador (no requiere Vite/CRA).

En que consiste
Una pagina simple en React que:
- Hace GET del candidato (Step 2) y la lista de posiciones (Step 3).
- Muestra las posiciones con un input por item para la URL del repo.
- Envia el POST a apply-to-job (Step 5) y maneja estados de carga y error.

Pasos
Step 1 — Crear el repositorio en GitHub
Creá un repositorio público en GitHub. Hacé al menos un commit inicial y tené a mano la URL del repo (ej: https://github.com/tu-usuario/tu-repo). La vas a necesitar en el Step 5.

Step 2 — Obtener tus datos de candidato
Hacé una llamada GET a la API pasando tu email como parámetro:

GET {BASE_URL}/api/candidate/get-by-email?email=TU_EMAIL
Respuesta (200):

{
  "uuid": "a1b2c3d4-...",
  "candidateId": "a1b2c3d4",
  "applicationId": "a1b2c3d4",
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane.doe@example.com"
}
Estos los vas a usar para enviar tu postulación.

Step 3 — Obtener la lista de posiciones abiertas
Hacé una llamada GET para obtener las posiciones disponibles:

GET {BASE_URL}/api/jobs/get-list
Respuesta (200):

[
  { "id": "4416372005", "title": "Fullstack developer" },
  { "id": "9100000001", "title": "Head Chef" }
]
Step 4 — Mostrar un listado de posiciones
Creá un componente en React que muestre un listado de las posiciones obtenidas en el paso anterior. Cada item de la lista debe incluir:

Título de la posición (title)
Un campo de input donde puedas ingresar la URL de tu repositorio de GitHub
Un botón "Submit" para enviar tu postulación a esa posición
Usá el estilo que prefieras — lo importante es que se vea prolijo y funcional.

Step 5 — Enviar tu postulación
Presioná el botón "Submit" para la posición a la que estás aplicando dentro de esta lista, llamando a la API con el siguiente body:

POST {BASE_URL}/api/candidate/apply-to-job
Content-Type: application/json
Body:

{
  "uuid": "tu uuid (del Step 2)",
  "jobId": "id de la posición (del Step 3)",
  "candidateId": "tu candidateId (del Step 2)",
  "repoUrl": "https://github.com/tu-usuario/tu-repo"
}
Campo	Valor
uuid	Tu uuid obtenido en el Step 2
jobId	El id de la posición desde la que hacés submit
candidateId	Tu candidateId obtenido en el Step 2
repoUrl	URL de tu repositorio de GitHub
Respuesta exitosa (200):

{ "ok": true }
Requisitos
Usar React (cualquier versión).
Mostrar un listado de posiciones obtenido de la API.
Cada posición debe tener un campo de input para la URL del repo de GitHub y un botón "Submit".
El botón debe hacer el POST con el body correcto.
Manejar estados de carga y error en la UI.
Qué evaluamos
Criterio	Qué miramos
Calidad de código	Código limpio, legible, buenas convenciones de nombrado
Componentes	Buena separación de componentes, aunque sea una app chica
Manejo de errores	Manejo adecuado de errores de red y respuestas de la API
Presentación visual	Un componente prolijo — no hace falta nada fancy
Resolución de problemas	Cómo manejás situaciones inesperadas
Tip: Cuando algo no funcione, leé el body de la respuesta — la API devuelve mensajes de error descriptivos.

Dudas?
Si algo no coincide con lo que esperabas o te trabás en algún punto, escribinos a ezequiel.dominguez@nimblegravity.com Hacer buenas preguntas es parte de ser buen developer.

Éxitos!


