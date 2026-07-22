import { db, initSchema } from "./db.js";

const PMO_FILES = new Set([
  "minuta-rai-v0.4.2-laura-itzel.html",
  "ofertaEducativa_9Julio.html",
  "rai-innovation-index-kickoff-minuta.html",
  "minuta-rai-service-blueprint-v042.html",
  "minuta-rai-alineacion-semanal-2026-07-17.html",
  "minuta-rai-sesion-semanal-interna-tono-mauricio-2026-07-20.html",
]);

// Ported verbatim from legacy-static/index.html
const MINUTAS = [
  {
    file: "minutas/minuta_rai_sesion_agentizacion_one_page.html",
    title: "Estamos agentizando RAI",
    date: "2026-07-02",
    desc: "Una sesión para alinear cómo RAI diseña, evalúa, mejora y delega agentes con estándar, criterio operativo y control.",
    tags: ["agentes"],
  },
  {
    file: "minutas/minuta-rai-v0.4.2-laura-itzel.html",
    title: "Seguimiento operativo RAI",
    date: "2026-07-06",
    desc: "Reunión interna sobre comunidad RAI, talentos, delegación, oferta educativa y RAI Diagnostic 360.",
    tags: ["sistemaOperativo", "comunidad", "neomaEducacion", "diagnostic360"],
  },
  {
    file: "minutas/minuta-seguimiento-operativo-RAI.html",
    title: "Contexto operativo para Lau",
    date: "2026-07-08",
    desc: "Contexto consolidado para mantener alineación sobre frentes activos, riesgos, owners y backlog. No es un documento para automatizar ni activar agentes todavía.",
    tags: ["sistemaOperativo", "general"],
  },
  {
    file: "minutas/ofertaEducativa_9Julio.html",
    title: "RAI x Oferta Educativa",
    date: "2026-07-09",
    desc: "Rediseño del proceso de intake, privacidad de datos, arquitectura de almacenamiento y siguientes pasos para Fase 0 y Fase 1.",
    tags: ["neomaEducacion"],
  },
  {
    file: "minutas/rai-innovation-index-kickoff-minuta.html",
    title: "Kickoff RAI Innovation Index",
    date: "2026-07-09",
    desc: "Minuta operativa PMO para seguimiento interno del kickoff de RAI Innovation Index / Diagnóstico 360.",
    tags: ["diagnostic360"],
  },
  {
    file: "minutas/RAI_x_JaguarMind_Minuta_Laura_Itzel.html",
    title: "RAI x JaguarMind",
    date: "2026-07-10",
    desc: "Contexto, acuerdos preliminares y preparación para la sesión de definición estratégica, técnica y legal del producto asociado a RAI Decision.",
    tags: ["general"],
  },
  {
    file: "minutas/RAI-360-Consolidado-Sesion-Concepto.html",
    title: "Consolidado — Sesión de Conceptualización de la experiencia",
    date: "2026-07-13",
    desc: "Lo que cerramos, lo que se movió del plan, lo que queda como punto de decisión y las tareas para el miércoles.",
    tags: ["diagnostic360"],
  },
  {
    file: "minutas/minuta-rai-service-blueprint-v042.html",
    title: "Service Blueprint - Alineación interna",
    date: "2026-07-15",
    desc: "Minuta orientada a seguimiento operativo del RAI Service Operating Blueprint, con foco en MVP, revisión crítica, economía operativa, roles y backlog futuro.",
    tags: ["sistemaOperativo", "diagnostic360"],
  },
  {
    file: "minutas/minuta-rai-alineacion-semanal-2026-07-17.html",
    title: "Alineacion Semanal",
    date: "2026-07-17",
    desc: "Minuta operativa PMO sobre MVP del Diagnostico 360, enfoque en Finanzas y Administracion, APQC, pagina de diagnostico y proximos pasos de Neoma.",
    tags: ["sistemaOperativo", "diagnostic360"],
  },
  {
    file: "minutas/minuta-rai-sesion-semanal-interna-tono-mauricio-2026-07-20.html",
    title: "Sesion semanal interna",
    date: "2026-07-20",
    desc: "Minuta operativa PMO sobre beta rapida del Diagnostico 360, framework financiero, NFC, networking y seguimiento interno.",
    tags: ["sistemaOperativo", "diagnostic360"],
  },
];

function task(file, title, responsable, fecha, estado) {
  return { file, title, responsable, fecha, estado };
}

// Ported verbatim from legacy-static/tareas-pendientes.html
const TASKS = [
  // Seguimiento operativo RAI — 2026-07-06
  task("minuta-rai-v0.4.2-laura-itzel.html", "Enviar mensaje a la comunidad con intención y objetivo de la primera sesión.", "Mauricio Pascal", "Por definir", "pendiente"),
  task("minuta-rai-v0.4.2-laura-itzel.html", "Preparar agente/newsletter o base de contenido para la primera sesión de comunidad RAI.", "Laura Itzel", "Viernes, fecha exacta por confirmar", "pendiente"),
  task("minuta-rai-v0.4.2-laura-itzel.html", "Enviar link o convocatoria para la sesión de comunidad.", "Laura Itzel", "Jueves, fecha exacta por confirmar", "pendiente"),
  task("minuta-rai-v0.4.2-laura-itzel.html", "Revisar si el agente de comunidad puede también funcionar como piloto del copiloto de innovación.", "Laura Itzel", "Por definir", "pendiente"),
  task("minuta-rai-v0.4.2-laura-itzel.html", "Preparar sesión directiva breve para revisar qué está haciendo cada responsable, qué no debería hacer y cómo delegarlo.", "Mauricio Pascal", "Por definir", "pendiente"),
  task("minuta-rai-v0.4.2-laura-itzel.html", "Pasar a Laura dos presentaciones sobre buen desempeño, principios de trabajo y onboarding de talentos.", "Mauricio Pascal", "Por definir", "pendiente"),
  task("minuta-rai-v0.4.2-laura-itzel.html", "Avanzar con Héctor la formalización legal para talentos, incluyendo acuerdos y protecciones bilaterales.", "Mauricio Pascal", "Por definir", "seguimiento"),
  task("minuta-rai-v0.4.2-laura-itzel.html", "Organizar pendientes actuales para identificar qué debe delegarse y qué sesiones preparar con talentos.", "Laura Itzel", "Lunes, martes y miércoles, fecha exacta por confirmar", "pendiente"),
  task("minuta-rai-v0.4.2-laura-itzel.html", "Preparar sesiones con posibles talentos para explicar proyectos y posibles tareas.", "Laura Itzel", "Jueves, fecha exacta por confirmar", "pendiente"),
  task("minuta-rai-v0.4.2-laura-itzel.html", "Trabajar el componente tecnológico de RAI Diagnostic 360 y compartir manual maestro de tecnología/información.", "Mauricio Pascal", "Por definir", "pendiente"),
  task("minuta-rai-v0.4.2-laura-itzel.html", "Extraer el cuestionario usado en la sesión de oferta educativa/diagnóstico y proponer qué puede sistematizarse.", "Laura Itzel", "Por definir", "pendiente"),
  task("minuta-rai-v0.4.2-laura-itzel.html", "Investigar benchmarks o casos de recopilación de información sensible con buena experiencia de usuario y privacidad.", "Mauricio Pascal y Laura Itzel", "Mañana, fecha exacta por confirmar", "pendiente"),
  task("minuta-rai-v0.4.2-laura-itzel.html", "Hacer recap Mauricio-Laura sobre alternativas para privacidad, experiencia y estructura futura de diagnóstico.", "Mauricio Pascal y Laura Itzel", "Mañana, fecha exacta por confirmar", "pendiente"),
  task("minuta-rai-v0.4.2-laura-itzel.html", "Preparar borrador de comunicación para Laura/Ana Laura sobre riesgo detectado y alternativas de solución.", "Laura Itzel", "Más tarde, fecha exacta por confirmar", "pendiente"),

  // RAI x Oferta Educativa — 2026-07-09
  task("ofertaEducativa_9Julio.html", "Solicitar a Carolina las instrucciones detalladas para realizar las pruebas psicométricas.", "Ana Laura Zavala", "Por definir", "pendiente"),
  task("ofertaEducativa_9Julio.html", "Enviar el mapa de evaluación con rubros y categorías de la batería psicométrica.", "Ana Laura Zavala", "Por definir", "pendiente"),
  task("ofertaEducativa_9Julio.html", "Enviar por correo el formulario actual de intake / admisión de personas.", "Laura Itzel", "Por definir", "pendiente"),
  task("ofertaEducativa_9Julio.html", "Crear un nuevo formulario de admisión que integre captura de datos personales bajo políticas de privacidad.", "Laura Itzel", "Por definir", "pendiente"),
  task("ofertaEducativa_9Julio.html", "Revisar y validar los formularios de admisión de personas y preferencias del consultor.", "El grupo", "Por definir", "pendiente"),
  task("ofertaEducativa_9Julio.html", "Definir el almacenamiento seguro para la base de datos privada con información sensible.", "El grupo", "Por definir", "pendiente"),
  task("ofertaEducativa_9Julio.html", "Completar las pruebas psicométricas enviadas por Carolina.", "Laura Itzel", "Por definir", "pendiente"),
  task("ofertaEducativa_9Julio.html", "Programar sesión de demostración del sistema automatizado.", "El grupo", "Próximo jueves, fecha exacta por confirmar", "pendiente"),

  // Kickoff RAI Innovation Index — 2026-07-09
  task("rai-innovation-index-kickoff-minuta.html", "Preparar sesión de conceptualización para definir perfiles, experiencia, módulos, decisiones de diseño y entregables del MVP.", "Antonio Guerra", "Lunes, fecha exacta por confirmar", "pendiente"),
  task("rai-innovation-index-kickoff-minuta.html", "Delimitar junto con Mauricio la Ruta RAI, el molde de servicios, capacidades base, límites de oferta y ruta posterior a venta.", "Antonio Guerra / Mauricio Pascal", "Por definir", "pendiente"),
  task("rai-innovation-index-kickoff-minuta.html", "Evolucionar propuesta visual de diagnóstico interactivo presentada por Pamela.", "Pamela Romo", "Lunes, fecha exacta por confirmar", "pendiente"),
  task("rai-innovation-index-kickoff-minuta.html", "Analizar lógica técnica del diagnóstico, datos necesarios, conexión entre entrevista, scoring, módulos y visualización.", "Laura Itzel", "Lunes, fecha exacta por confirmar", "pendiente"),
  task("rai-innovation-index-kickoff-minuta.html", "Terminar primer molde de lo que sucede después de la venta: talento necesario, metas, capacidad operativa y proyección.", "Mauricio Pascal", "Lunes, fecha exacta por confirmar", "pendiente"),
  task("rai-innovation-index-kickoff-minuta.html", "Compartir transcript y tablero de trabajo para que el equipo revise antes de la siguiente sesión.", "Antonio Guerra", "Por definir", "seguimiento"),

  // Service Blueprint - Alineación interna — 2026-07-15
  task("minuta-rai-service-blueprint-v042.html", "Enviar chat, minuta, links a los siete entregables y recursos de revisión.", "Mauricio Pascal", "Por definir", "pendiente"),
  task("minuta-rai-service-blueprint-v042.html", "Revisar los siete entregables del blueprint y hacer comentarios críticos.", "Antonio Guerra", "Viernes, fecha exacta por confirmar", "pendiente"),
  task("minuta-rai-service-blueprint-v042.html", "Hacer revisión estratégica del blueprint para detectar riesgos, simplificación necesaria y conexión con tecnología.", "Laura Itzel", "Viernes, fecha exacta por confirmar", "pendiente"),
  task("minuta-rai-service-blueprint-v042.html", "Preparar un one page de alineación con MVP, ruta ideal, conexión con Diagnostic 360 y puntos críticos.", "Mauricio Pascal / Antonio Guerra", "Jueves o viernes, fecha exacta por confirmar", "pendiente"),
  task("minuta-rai-service-blueprint-v042.html", "Definir cuál sería la ruta inicial que RAI puede comprometer con un cliente.", "Mauricio Pascal / Antonio Guerra", "Por definir", "pendiente"),
  task("minuta-rai-service-blueprint-v042.html", "Delimitar servicios posibles, cliente ideal, fases, duración, talento requerido y criterios de ejecución.", "Mauricio Pascal / Antonio Guerra", "Por definir", "pendiente"),
  task("minuta-rai-service-blueprint-v042.html", "Trabajar esquemas financieros, monetarios y unit economics del blueprint.", "Mauricio Pascal", "Por definir", "pendiente"),
  task("minuta-rai-service-blueprint-v042.html", "Avanzar MVP de página interna / archivo de minutas con diseño interino.", "Laura Itzel", "Por definir", "pendiente"),
  task("minuta-rai-service-blueprint-v042.html", "Enviar logos, paleta, referencias visuales o carpeta base para la página interna.", "Mauricio Pascal", "Mañana, fecha exacta por confirmar", "pendiente"),
  task("minuta-rai-service-blueprint-v042.html", "Procesar o apoyar con la minuta de la sesión.", "Antonio Guerra", "Mañana, fecha exacta por confirmar", "pendiente"),

  // Alineacion Semanal - 2026-07-17
  task("minuta-rai-alineacion-semanal-2026-07-17.html", "Proponer una alternativa adicional de MVP distinta a Finanzas/Administracion y Capital Humano.", "Antonio Guerra", "Por definir", "pendiente"),
  task("minuta-rai-alineacion-semanal-2026-07-17.html", "Desarrollar la metodologia del Diagnostico 360 para Finanzas/Administracion y Capital Humano.", "Mauricio Pascal / Antonio Guerra", "lunes, fecha exacta por confirmar", "pendiente"),
  task("minuta-rai-alineacion-semanal-2026-07-17.html", "Investigar APQC, criterios y formato para validar procesos financieros y administrativos.", "Mauricio Pascal / Equipo", "Por definir", "pendiente"),
  task("minuta-rai-alineacion-semanal-2026-07-17.html", "Integrar la pagina del diagnostico con la base de conocimiento interna.", "Laura Itzel", "Por definir", "pendiente"),
  task("minuta-rai-alineacion-semanal-2026-07-17.html", "Preparar presentacion de capacitacion y handoff de Neoma.", "Laura Itzel", "lunes, fecha exacta por confirmar", "pendiente"),
  task("minuta-rai-alineacion-semanal-2026-07-17.html", "Verificar disponibilidad de cuenta empresarial para asignar agentes de IA y conectores de Google Drive/Table en Neoma.", "Laura Itzel / Por definir", "lunes, fecha exacta por confirmar", "pendiente"),
  task("minuta-rai-alineacion-semanal-2026-07-17.html", "Actualizar tareas pendientes en la aplicacion compartida y cerrar las que ya esten contestadas por los entregables.", "Equipo", "Por definir", "seguimiento"),

  // Sesion semanal interna - 2026-07-20
  task("minuta-rai-sesion-semanal-interna-tono-mauricio-2026-07-20.html", "Definir los modulos del Diagnostico 360 y redactar preguntas simples, intuitivas y practicas.", "Antonio Guerra", "Por definir", "pendiente"),
  task("minuta-rai-sesion-semanal-interna-tono-mauricio-2026-07-20.html", "Comparar referencias tipo APQC, Gartner, ISO u otras para seleccionar dimensiones utiles del framework propio.", "Antonio Guerra", "Por definir", "pendiente"),
  task("minuta-rai-sesion-semanal-interna-tono-mauricio-2026-07-20.html", "Buscar eventos, personas y espacios de networking para promocionar el diagnostico beta.", "Mauricio Pascal", "Por definir", "pendiente"),
  task("minuta-rai-sesion-semanal-interna-tono-mauricio-2026-07-20.html", "Preparar materiales fisicos y flujo NFC para conectar tarjetas, stickers o links al diagnostico.", "Mauricio Pascal", "Por definir", "pendiente"),
  task("minuta-rai-sesion-semanal-interna-tono-mauricio-2026-07-20.html", "Explorar alianzas universitarias, ferias de emprendimiento y talento practicante para levantar diagnosticos y apoyar investigacion.", "Mauricio Pascal", "Por definir", "pendiente"),
  task("minuta-rai-sesion-semanal-interna-tono-mauricio-2026-07-20.html", "Buscar una persona de apoyo para Laura en iniciativas internas de conocimiento, minutas y gestion de pendientes.", "Mauricio Pascal", "Por definir", "pendiente"),
  task("minuta-rai-sesion-semanal-interna-tono-mauricio-2026-07-20.html", "Agregar la minuta y generar pendientes dentro de la herramienta interna como solucion interina.", "Laura Itzel", "Por definir", "seguimiento"),
];

function reset() {
  db.exec("DROP TABLE IF EXISTS tasks; DROP TABLE IF EXISTS minutas;");
  initSchema();
  console.log("Tablas recreadas (--reset).");
}

function seedMinutas() {
  const insert = db.prepare(`
    INSERT INTO minutas (file, title, date, desc, tags, has_pmo)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(file) DO NOTHING
  `);
  let inserted = 0;
  for (const m of MINUTAS) {
    const bareFile = m.file.replace(/^minutas\//, "");
    const hasPmo = PMO_FILES.has(bareFile) ? 1 : 0;
    const result = insert.run(m.file, m.title, m.date, m.desc, JSON.stringify(m.tags), hasPmo);
    if (result.changes > 0) inserted++;
  }
  console.log(`Minutas: ${inserted} insertadas, ${MINUTAS.length - inserted} ya existían.`);
}

function seedTasks() {
  const findMinuta = db.prepare("SELECT id FROM minutas WHERE file = ?");
  const findExisting = db.prepare(
    "SELECT 1 FROM tasks WHERE minuta_id IS ? AND title = ? AND responsable = ?"
  );
  const insert = db.prepare(`
    INSERT INTO tasks (minuta_id, title, responsable, fecha, estado)
    VALUES (?, ?, ?, ?, ?)
  `);

  let inserted = 0;
  db.exec("BEGIN");
  try {
    for (const t of TASKS) {
      const minuta = findMinuta.get(`minutas/${t.file}`);
      const minutaId = minuta ? minuta.id : null;
      const exists = findExisting.get(minutaId, t.title, t.responsable);
      if (exists) continue;
      insert.run(minutaId, t.title, t.responsable, t.fecha, t.estado);
      inserted++;
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
  console.log(`Tasks: ${inserted} insertadas, ${TASKS.length - inserted} ya existían.`);
}

if (process.argv.includes("--reset")) {
  reset();
}

seedMinutas();
seedTasks();
console.log("Seed completado.");
