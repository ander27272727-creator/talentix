/**
 * Seed: Pool de rotación de preguntas por batería (+10 por evaluación existente).
 * Idempotente: usa upsert por questionId. Ejecutar: node scripts/seed-question-pools.js
 * Requiere DATABASE_URL en .env.local
 */
const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

// Cargar .env.local manualmente
const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z_]+)="(.*)"$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2]
  }
}
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const prisma = new PrismaClient()

// Helpers
function likert(id, assessmentId, dimension, text, reverse = false, order = 0) {
  const opts = [
    { label: 'Totalmente en desacuerdo', value: 1 },
    { label: 'En desacuerdo', value: 2 },
    { label: 'Neutral', value: 3 },
    { label: 'De acuerdo', value: 4 },
    { label: 'Totalmente de acuerdo', value: 5 },
  ]
  return {
    questionId: id,
    assessmentId,
    type: 'LIKERT_SCALE',
    dimension,
    text,
    options: opts,
    reverseScored: reverse,
    order,
  }
}

function situational(id, assessmentId, dimension, scenario, text, options) {
  return {
    questionId: id,
    assessmentId,
    type: 'SCENARIO',
    dimension,
    scenario,
    text,
    options,
    reverseScored: false,
    order: 0,
  }
}

// ===== POOLS =====
const POOLS = {
  // ---- Personalidad (Big Five) ----
  assess_psych_personality: [
    likert('q_o1_r1', 'assess_psych_personality', 'openness', 'Me atrae aprender métodos de trabajo completamente nuevos.', false, 101),
    likert('q_o1_r2', 'assess_psych_personality', 'openness', 'Prefiero que las cosas se hagan siempre como siempre se han hecho.', true, 102),
    likert('q_c1_r1', 'assess_psych_personality', 'conscientiousness', 'Reviso mi trabajo una segunda vez antes de entregarlo.', false, 103),
    likert('q_c1_r2', 'assess_psych_personality', 'conscientiousness', 'A veces dejo tareas para después hasta que se vuelven urgentes.', true, 104),
    likert('q_e1_r1', 'assess_psych_personality', 'extraversion', 'Me resulta fácil iniciar conversaciones con personas desconocidas.', false, 105),
    likert('q_e1_r2', 'assess_psych_personality', 'extraversion', 'Prefiero trabajar solo antes que en equipo.', true, 106),
    likert('q_a1_r1', 'assess_psych_personality', 'agreeableness', 'Busco acuerdos donde ambas partes sientan que ganan.', false, 107),
    likert('q_a1_r2', 'assess_psych_personality', 'agreeableness', 'Discutir hasta imponer mi punto de vista es lo natural.', true, 108),
    likert('q_n1_r1', 'assess_psych_personality', 'neuroticism', 'Bajo presión mantengo la calma y pienso con claridad.', false, 109),
    likert('q_n1_r2', 'assess_psych_personality', 'neuroticism', 'Pequeños contratiempos me alteran todo el día.', true, 110),
  ],

  // ---- Lógica (cognitiva) ----
  assess_cog_logic: [
    situational('q_l_r1', 'assess_cog_logic', 'logical', 'Un puente admite máximo 10 toneladas. Un camión de 8 toneladas lleva carga de 4 toneladas.', '¿Puede cruzar?', [
      { label: 'Sí, va sobrado', value: 0 },
      { label: 'No, excede el límite', value: 1 },
      { label: 'Depende del puente', value: 0 },
    ]),
    situational('q_l_r2', 'assess_cog_logic', 'logical', 'Si todos los clientes del plan Premium pagan mensualidad, y Juan no paga mensualidad...', '¿Qué concluimos?', [
      { label: 'Juan está moroso', value: 0 },
      { label: 'Juan no es cliente Premium', value: 1 },
      { label: 'Juan es cliente ocasional', value: 0 },
    ]),
    situational('q_l_r3', 'assess_cog_logic', 'numerical', 'Una promoción aplica 20% de descuento y luego 10% adicional sobre el precio ya descontado.', '¿Descuento total aproximado?', [
      { label: '28%', value: 1 },
      { label: '30%', value: 0 },
      { label: '25%', value: 0 },
    ]),
    situational('q_l_r4', 'assess_cog_logic', 'pattern', 'Serie: 2, 6, 12, 20, 30, ...', '¿Qué número sigue?', [
      { label: '40', value: 0 },
      { label: '42', value: 1 },
      { label: '36', value: 0 },
    ]),
    situational('q_l_r5', 'assess_cog_logic', 'numerical', 'Si 3 empleados empaquetan 90 cajas en una hora, con el mismo ritmo...', '¿Cuántas cajas empaquetan 5 empleados en una hora?', [
      { label: '135', value: 0 },
      { label: '150', value: 1 },
      { label: '180', value: 0 },
    ]),
    situational('q_l_r6', 'assess_cog_logic', 'logical', 'El informe A contradice al B. El B concuerda con el C verificado.', '¿Cuál es más confiable?', [
      { label: 'A', value: 0 },
      { label: 'B', value: 0 },
      { label: 'C', value: 1 },
    ]),
    situational('q_l_r7', 'assess_cog_logic', 'numerical', 'Una llamada de 7 minutos cuesta $1.40. Otra de 12 minutos, misma tarifa.', '¿Cuánto cuesta la segunda?', [
      { label: '$2.40', value: 1 },
      { label: '$2.10', value: 0 },
      { label: '$2.80', value: 0 },
    ]),
    situational('q_l_r8', 'assess_cog_logic', 'pattern', 'Serie de letras: A, C, F, J, O, ...', '¿Qué letra sigue?', [
      { label: 'T', value: 1 },
      { label: 'S', value: 0 },
      { label: 'U', value: 0 },
    ]),
    situational('q_l_r9', 'assess_cog_logic', 'logical', 'Ana llega antes que Beto y después de Carla. Carla no fue la primera.', '¿Quién llegó primero?', [
      { label: 'Ana', value: 0 },
      { label: 'Carla', value: 0 },
      { label: 'Imposible: Carla fue primera por eliminación es Beto', value: 0 },
    ]),
    likert('q_l_r10', 'assess_cog_logic', 'consistency', 'Cuando no entiendo un problema numérico, lo intento por partes antes de rendirme.', false, 118),
  ],

  // ---- SJT (comportamental) ----
  assess_behav_sjt: [
    situational('q_sjt_r1', 'assess_behav_sjt', 'teamwork', 'Un compañero se atribuye tu idea en una reunión con el gerente.', '¿Qué haces?', [
      { label: 'Lo confronto en el momento', value: 0 },
      { label: 'Hablo con él en privado y aclaro los hechos', value: 1 },
      { label: 'No digo nada para evitar conflicto', value: 0 },
    ]),
    situational('q_sjt_r2', 'assess_behav_sjt', 'adaptability', 'La empresa cambia la herramienta que usabas por una nueva sin capacitación.', '¿Qué haces?', [
      { label: 'Espero a que me capaciten', value: 0 },
      { label: 'Aprendo por mi cuenta con tutoriales y practico', value: 1 },
      { label: 'Sigo usando la antigua en secreto', value: 0 },
    ]),
    situational('q_sjt_r3', 'assess_behav_sjt', 'integrity', 'Encuentras una billetera con dinero en el piso de la oficina.', '¿Qué haces?', [
      { label: 'La guardo hasta que alguien la reclame', value: 0 },
      { label: 'La entrego a mi supervisor de inmediato', value: 1 },
      { label: 'Depende de cuánto dinero tenga', value: 0 },
    ]),
    situational('q_sjt_r4', 'assess_behav_sjt', 'stress', 'Son las 6pm, termina tu jornada y llega una solicitud urgente que toma 2 horas.', '¿Qué haces?', [
      { label: 'Me voy, es mi horario', value: 0 },
      { label: 'Aviso a mi jefe, priorizo y me quedo si es crítico', value: 1 },
      { label: 'La dejo para mañana sin avisar', value: 0 },
    ]),
    situational('q_sjt_r5', 'assess_behav_sjt', 'communication', 'Debes anunciar un retraso en un proyecto a un cliente molesto.', '¿Qué haces?', [
      { label: 'Evito la llamada hasta tener buenas noticias', value: 0 },
      { label: 'Lo llamo, explico el motivo real y doy un plan', value: 1 },
      { label: 'Le escribo un mensaje corto y vago', value: 0 },
    ]),
    situational('q_sjt_r6', 'assess_behav_sjt', 'teamwork', 'El equipo no llega a acuerdo y el plazo vence mañana.', '¿Qué haces?', [
      { label: 'Insisto en mi propuesta hasta que cedan', value: 0 },
      { label: 'Propongo votar y comprometerme con la mayoría', value: 1 },
      { label: 'Hago mi parte como yo creo correcto', value: 0 },
    ]),
    likert('q_sjt_r7', 'assess_behav_sjt', 'responsibility', 'Si me equivoco en el trabajo, admito el error aunque haya consecuencias.', false, 111),
    likert('q_sjt_r8', 'assess_behav_sjt', 'responsibility', 'Culpo a las circunstancias cuando algo sale mal por mi causa.', true, 112),
    likert('q_sjt_r9', 'assess_behav_sjt', 'punctuality', 'Llegar 5 minutos tarde me parece normal si nadie se da cuenta.', true, 113),
    likert('q_sjt_r10', 'assess_behav_sjt', 'punctuality', 'Planifico mi día la noche anterior.', false, 114),
  ],

  // ---- Ventas / Call Center ----
  assess_sales_callcenter: [
    likert('q_v_r1', 'assess_sales_callcenter', 'resilience', 'Después de un "no", tengo energía para la siguiente llamada.', false, 101),
    likert('q_v_r2', 'assess_sales_callcenter', 'resilience', 'Si rechazan mi oferta, es señal de que este trabajo no es para mí.', true, 102),
    situational('q_v_r3', 'assess_sales_callcenter', 'objections', 'El cliente dice: "Ya me estafaron con una oferta parecida".', 'Mejor respuesta:', [
      { label: 'Insistir en que nosotros somos diferentes', value: 0 },
      { label: 'Validar su experiencia y ofrecerle verificar todo por escrito', value: 1 },
      { label: 'Terminar la llamada amablemente', value: 0 },
    ]),
    situational('q_v_r4', 'assess_sales_callcenter', 'closing', 'El cliente muestra interés pero dice "lo voy a pensar".', 'Mejor cierre:', [
      { label: 'Respetar y colgar', value: 0 },
      { label: 'Preguntar qué le falta por decidir y proponer un siguiente paso concreto', value: 1 },
      { label: 'Bajar el precio en el momento', value: 0 },
    ]),
    situational('q_v_r5', 'assess_sales_callcenter', 'pipeline', 'Tienes 30 minutos y 15 pendientes de llamar.', '¿Qué priorizas?', [
      { label: 'Los que suenan primero en la lista', value: 0 },
      { label: 'Los más probables de cerrar y los más urgentes', value: 1 },
      { label: 'Alfabéticamente', value: 0 },
    ]),
    likert('q_v_r6', 'assess_sales_callcenter', 'empathy', 'Antes de ofrecer, me aseguro de entender el problema del cliente.', false, 103),
    likert('q_v_r7', 'assess_sales_callcenter', 'empathy', 'Vender es hablar; escuchar es perder el tiempo.', true, 104),
    situational('q_v_r8', 'assess_sales_callcenter', 'objectives', 'Te asignan una cuota que consideras imposible.', '¿Qué haces?', [
      { label: 'Me quejo con el equipo', value: 0 },
      { label: 'La divido en metas semanales y pido apoyo donde falte', value: 1 },
      { label: 'La acepto y veo qué pasa', value: 0 },
    ]),
    likert('q_v_r9', 'assess_sales_callcenter', 'energy', 'Mantengo el mismo tono de voz en la llamada 50 como en la primera.', false, 105),
    likert('q_v_r10', 'assess_sales_callcenter', 'energy', 'Para el final del turno ya no me importa el tono de voz.', true, 106),
  ],

  // ---- Cobranzas ----
  assess_collections: [
    likert('q_cob_r1', 'assess_collections', 'resilience', 'Cuando un deudor me cuelga, marco al siguiente sin perder el ánimo.', false, 101),
    likert('q_cob_r2', 'assess_collections', 'resilience', 'La cobranza es un trabajo de malas noticias y me desgasta.', true, 102),
    situational('q_cob_r3', 'assess_collections', 'negotiation', 'El deudor ofrece pagar la mitad en 3 meses sin compromiso escrito.', 'Mejor respuesta:', [
      { label: 'Acepto de palabra', value: 0 },
      { label: 'Concreto un plan de pagos firmado con fecha y montos', value: 1 },
      { label: 'Le cuelgo', value: 0 },
    ]),
    situational('q_cob_r4', 'assess_collections', 'compliance', 'El deudor grita y te insulta.', 'Qué haces:', [
      { label: 'Grito de vuelta para imponerme', value: 0 },
      { label: 'Mantengo la calma, recuerdo el objetivo y ofrezco opciones', value: 1 },
      { label: 'Lo amenazo con consecuencias legales', value: 0 },
    ]),
    situational('q_cob_r5', 'assess_collections', 'prioritization', 'Tienes una cartera grande y solo 2 horas.', 'Qué priorizas:', [
      { label: 'Los montos más grandes', value: 0 },
      { label: 'Mayor probabilidad de recuperar × monto (cartera fresca y compromisos próximos)', value: 1 },
      { label: 'Los más antiguos', value: 0 },
    ]),
    likert('q_cob_r6', 'assess_collections', 'empathy', 'Entiendo que detrás de una deuda hay una situación personal.', false, 103),
    likert('q_cob_r7', 'assess_collections', 'empathy', 'Mi trabajo es presionar, no comprender.', true, 104),
    situational('q_cob_r8', 'assess_collections', 'negotiation', 'El deudor pide "un día más" por quinta vez.', 'Qué haces:', [
      { label: 'Otro día más, quizás paga', value: 0 },
      { label: 'Firmo un acuerdo con fecha límite final y consecuencias claras', value: 1 },
      { label: 'Escala a legal de inmediato', value: 0 },
    ]),
    likert('q_cob_r9', 'assess_collections', 'ethics', 'Para cobrar, el fin justifica los medios.', true, 105),
    likert('q_cob_r10', 'assess_collections', 'ethics', 'Cumplo la normativa de trato al deudor aunque él no coopere.', false, 106),
  ],

  // ---- Atención al Cliente ----
  assess_customer_service: [
    likert('q_ac_r1', 'assess_customer_service', 'patience', 'Un cliente que repite lo mismo 3 veces merece la misma paciencia.', false, 101),
    likert('q_ac_r2', 'assess_customer_service', 'patience', 'Los clientes molestos son culpa del cliente, no mía.', true, 102),
    situational('q_ac_r3', 'assess_customer_service', 'conflict', 'El cliente grita que quiere hablar "con alguien que sirva".', 'Mejor respuesta:', [
      { label: 'Le explico que yo sí puedo ayudarle y tomo el caso', value: 1 },
      { label: 'Lo paso al supervisor de inmediato', value: 0 },
      { label: 'Le pido que se calme primero', value: 0 },
    ]),
    situational('q_ac_r4', 'assess_customer_service', 'resolution', 'No puedes resolver su problema pero sí otro agente.', 'Qué haces:', [
      { label: 'Transfiero y me olvido', value: 0 },
      { label: 'Explico quién le ayudará, resumo el caso y confirmo que fue atendido', value: 1 },
      { label: 'Le doy el número general', value: 0 },
    ]),
    situational('q_ac_r5', 'assess_customer_service', 'multichannel', 'Tienes 8 chats abiertos simultáneos.', 'Cómo los manejas:', [
      { label: 'Uno por uno en orden', value: 0 },
      { label: 'Priorizo por urgencia y doy respuestas concretas a todos', value: 1 },
      { label: 'Cierro los que tardan en responder', value: 0 },
    ]),
    likert('q_ac_r6', 'assess_customer_service', 'empathy', 'Antes de la solución, el cliente necesita sentirse escuchado.', false, 103),
    likert('q_ac_r7', 'assess_customer_service', 'empathy', 'Ser amable es opcional si el cliente es grosero.', true, 104),
    situational('q_ac_r6b', 'assess_customer_service', 'quality', 'El sistema falla y no puedes acceder a los datos del cliente.', 'Qué haces:', [
      { label: 'Le digo que vuelva a llamar cuando funcione', value: 0 },
      { label: 'Aviso, ofrezco alternativa y registro el caso para seguimiento', value: 1 },
      { label: 'Le pido que espere en línea indefinidamente', value: 0 },
    ]),
    likert('q_ac_r9', 'assess_customer_service', 'consistency', 'Doy el mismo servicio el primer día del mes que el último.', false, 105),
    likert('q_ac_r10', 'assess_customer_service', 'consistency', 'A fin de mes mi calidad baja, es normal.', true, 106),
  ],

  // ---- Retail / Vendedor de tienda ----
  assess_retail_sales: [
    situational('q_rt_r1', 'assess_retail_sales', 'approach', 'Un cliente mira un artículo 2 minutos sin pedir ayuda.', 'Qué haces:', [
      { label: 'Lo ignoro hasta que pregunte', value: 0 },
      { label: 'Me acerco con una pregunta útil, no con presión', value: 1 },
      { label: 'Lo presiono con la oferta del día', value: 0 },
    ]),
    situational('q_rt_r2', 'assess_retail_sales', 'value', '"En otra tienda está más barato".', 'Mejor respuesta:', [
      { label: 'Bajo el precio de inmediato', value: 0 },
      { label: 'Vendo el valor: garantía, servicio y postventa', value: 1 },
      { label: 'Le digo que se quede con la otra tienda', value: 0 },
    ]),
    situational('q_rt_r3', 'assess_retail_sales', 'alternatives', 'No queda su talla del producto que quería.', 'Qué haces:', [
      { label: 'Le digo que no hay', value: 0 },
      { label: 'Ofrezco alternativa similar, encargo o aviso de reposición', value: 1 },
      { label: 'Le vendo otra talla aunque no le quede', value: 0 },
    ]),
    likert('q_rt_r4', 'assess_retail_sales', 'service', 'Un cliente que no compra hoy, vuelve si lo traté bien.', false, 101),
    likert('q_rt_r5', 'assess_retail_sales', 'service', 'Mi meta es vender, no que el cliente vuelva.', true, 102),
    situational('q_rt_r6', 'assess_retail_sales', 'integrity', 'Ves a un compañero dándole productos a un cliente sin pasarlos por caja.', 'Qué haces:', [
      { label: 'No me meto', value: 0 },
      { label: 'Lo reporto al encargado', value: 1 },
      { label: 'Le pido mi parte', value: 0 },
    ]),
    likert('q_rt_r7', 'assess_retail_sales', 'initiative', 'En horas valle, ordeno y organizo la tienda por iniciativa propia.', false, 103),
    likert('q_rt_r8', 'assess_retail_sales', 'initiative', 'Si no hay clientes, está bien estar en el celular.', true, 104),
    situational('q_rt_r9', 'assess_retail_sales', 'conflict', 'El cliente exige devolución sin recibo y la política lo prohíbe.', 'Qué haces:', [
      { label: 'Hago la excepción para evitar el conflicto', value: 0 },
      { label: 'Explico la política y ofrezco alternativas (cambio o crédito)', value: 1 },
      { label: 'Le digo simplemente que no', value: 0 },
    ]),
    likert('q_rt_r10', 'assess_retail_sales', 'energy', 'Mantengo la energía de la primera hora durante todo el turno.', false, 105),
  ],

  // ---- Conducción ----
  assess_driver: [
    likert('q_dr_r1', 'assess_driver', 'safety', 'Reviso el vehículo (frenos, luces, llantas) antes de cada ruta.', false, 101),
    likert('q_dr_r2', 'assess_driver', 'safety', 'Si tengo prisa, me paso los altos en rojo cuando no viene nadie.', true, 102),
    situational('q_dr_r3', 'assess_driver', 'problems', 'La entrega falla porque el destinatario no está.', 'Qué haces:', [
      { label: 'Dejo el paquete en la puerta y me voy', value: 0 },
      { label: 'Sigo el protocolo: aviso, registro intento y coordino reintento', value: 1 },
      { label: 'Regreso a base sin avisar', value: 0 },
    ]),
    situational('q_dr_r4', 'assess_driver', 'weather', 'Lluvia fuerte y el GPS marca ruta más rápida por carretera destapada.', 'Qué decides:', [
      { label: 'La rápida siempre', value: 0 },
      { label: 'La ruta segura aunque tarde más, informando el retraso', value: 1 },
      { label: 'Espero a que pare la lluvia sin avisar', value: 0 },
    ]),
    likert('q_dr_r5', 'assess_driver', 'temper', 'Otro conductor me corta: sigo conduciendo con calma.', false, 103),
    likert('q_dr_r6', 'assess_driver', 'temper', 'Si me cortan, toco el claxon largo y me les acerco.', true, 104),
    situational('q_dr_r7', 'assess_driver', 'responsibility', 'Notas un raro en los frenos a mitad de ruta.', 'Qué haces:', [
      { label: 'Termino la ruta y luego lo reviso', value: 0 },
      { label: 'Detengo, reporto y no sigo con el vehículo en esas condiciones', value: 1 },
      { label: 'Le echo agua y sigo', value: 0 },
    ]),
    likert('q_dr_r8', 'assess_driver', 'punctuality', 'Salgo 15 minutos antes para garantizar entregas a tiempo.', false, 105),
    likert('q_dr_r9', 'assess_driver', 'punctuality', 'El tráfico es culpa de la empresa, no mía si llego tarde.', true, 106),
    situational('q_dr_r10', 'assess_driver', 'honesty', 'Te ofrecen propina extra para "olvidar" entregar el comprobante de una entrega.', 'Qué haces:', [
      { label: 'La acepto, es dinero extra', value: 0 },
      { label: 'La rechazo y sigo el procedimiento completo', value: 1 },
      { label: 'Depende del monto', value: 0 },
    ]),
  ],

  // ---- Redacción ----
  assess_writing: [
    situational('q_wr_r1', 'assess_writing', 'grammar', 'Elige la oración correcta:', 'Gramática:', [
      { label: 'Habían muchas personas en el evento', value: 0 },
      { label: 'Había muchas personas en el evento', value: 1 },
      { label: 'Haban muchas personas en el evento', value: 0 },
    ]),
    situational('q_wr_r2', 'assess_writing', 'clarity', 'Debes explicar un proceso técnico a alguien no técnico.', 'Mejor enfoque:', [
      { label: 'Uso el mismo vocabulario técnico', value: 0 },
      { label: 'Uso analogías y ejemplos concretos, sin perder precisión', value: 1 },
      { label: 'Resumo tanto que ya no dice nada', value: 0 },
    ]),
    situational('q_wr_r3', 'assess_writing', 'verification', 'Encuentras un dato impactante en una sola web sin fuente.', 'Qué haces:', [
      { label: 'Lo publico, mientras más llamativo mejor', value: 0 },
      { label: 'Lo verifico en al menos dos fuentes confiables', value: 1 },
      { label: 'Lo publico citando "según internet"', value: 0 },
    ]),
    situational('q_wr_r4', 'assess_writing', 'seo', 'Título para un artículo sobre ahorro de energía en casa:', 'Mejor título:', [
      { label: 'Reflexiones sobre el consumo', value: 0 },
      { label: '7 formas de reducir tu factura de luz (con datos reales)', value: 1 },
      { label: 'Energía', value: 0 },
    ]),
    likert('q_wr_r5', 'assess_writing', 'feedback', 'Una corrección dura me sirve para escribir mejor la próxima vez.', false, 101),
    likert('q_wr_r6', 'assess_writing', 'feedback', 'Si me corrigen mucho, es que el editor me tiene algo personal.', true, 102),
    situational('q_wr_r7', 'assess_writing', 'deadlines', 'Entregas en 3 horas y te piden reescribir la mitad.', 'Qué haces:', [
      { label: 'Aviso que es imposible', value: 0 },
      { label: 'Priorizo lo esencial, negocio alcance y cumplo el plazo', value: 1 },
      { label: 'Entrego lo mismo sin cambios', value: 0 },
    ]),
    likert('q_wr_r8', 'assess_writing', 'consistency', 'Reviso ortografía y puntuación antes de entregar cualquier texto.', false, 103),
    likert('q_wr_r9', 'assess_writing', 'consistency', 'El corrector automático es suficiente, no necesito releer.', true, 104),
    situational('q_wr_r10', 'assess_writing', 'structure', 'Texto de 500 palabras que "no engancha".', 'Primer cambio:', [
      { label: 'Cambio todas las palabras por sinónimos', value: 0 },
      { label: 'Reviso la estructura: primera frase, orden de ideas y cierre', value: 1 },
      { label: 'Le agrego emojis y mayúsculas', value: 0 },
    ]),
  ],

  // ---- Seguridad ----
  assess_security: [
    likert('q_seg_r1', 'assess_security', 'vigilance', 'Después de 4 horas de turno, mantengo la misma atención que al inicio.', false, 101),
    likert('q_seg_r2', 'assess_security', 'vigilance', 'Es normal mirar el celular cuando el turno está tranquilo.', true, 102),
    situational('q_seg_r3', 'assess_security', 'protocol', 'Un visitante sin credencial insiste en pasar por una emergencia "familiar".', 'Qué haces:', [
      { label: 'Lo dejo pasar por humanidad', value: 0 },
      { label: 'Sigo el protocolo: verifico con el área destino y registro el incidente', value: 1 },
      { label: 'Lo dejo pasar pero lo anoto', value: 0 },
    ]),
    situational('q_seg_r4', 'assess_security', 'protocol', 'Se activa la alarma de incendio y hay pánico.', 'Tu acción:', [
      { label: 'Me voy primero para estar seguro', value: 0 },
      { label: 'Guío la evacuación por la ruta designada y verifico áreas', value: 1 },
      { label: 'Espero instrucciones sin hacer nada', value: 0 },
    ]),
    situational('q_seg_r5', 'assess_security', 'integrity', 'Un ejecutivo te pide dejar pasar su visita sin registro, "es tu jefe".', 'Qué haces:', [
      { label: 'Obedezco, es mi superior', value: 0 },
      { label: 'Aplico el protocolo igual, el registro protege a todos', value: 1 },
      { label: 'Depende del área', value: 0 },
    ]),
    likert('q_seg_r6', 'assess_security', 'integrity', 'El protocolo aplica igual para todos, sin excepciones.', false, 103),
    likert('q_seg_r7', 'assess_security', 'integrity', 'Con la gente importante, ciertas reglas no aplican.', true, 104),
    situational('q_seg_r8', 'assess_security', 'response', 'Detectas a una persona forcejeando la cerradura de una oficina.', 'Qué haces:', [
      { label: 'La confronto yo solo de inmediato', value: 0 },
      { label: 'Observo, reporto por radio y sigo el protocolo de intrusión', value: 1 },
      { label: 'Hago como que no vi', value: 0 },
    ]),
    likert('q_seg_r9', 'assess_security', 'reporting', 'Documentar cada incidente por pequeño que sea, es parte del trabajo.', false, 105),
    likert('q_seg_r10', 'assess_security', 'reporting', 'Reportar todo genera papeleo innecesario.', true, 106),
  ],

  // ---- Salud ----
  assess_health_care: [
    likert('q_hc_r1', 'assess_health_care', 'hygiene', 'Me lavo las manos entre cada paciente aunque pierda tiempo.', false, 101),
    likert('q_hc_r2', 'assess_health_care', 'hygiene', 'Si me lavé hace 10 minutos, no hace falta de nuevo.', true, 102),
    situational('q_hc_r3', 'assess_health_care', 'emergency', 'Un adulto mayor se cae en el pasillo y no se levanta.', 'Primer paso:', [
      { label: 'Lo levanto de inmediato', value: 0 },
      { label: 'No lo muevo: evalúo conciencia, signos y llamo ayuda', value: 1 },
      { label: 'Le pregunto qué pasó y espero', value: 0 },
    ]),
    situational('q_hc_r4', 'assess_health_care', 'triage', 'Tres pacientes: uno con dolor torácico, otro con fiebre leve, otro pidiendo un vaso de agua.', 'A quién atiendes primero:', [
      { label: 'Al que grita más', value: 0 },
      { label: 'Al de dolor torácico (riesgo vital)', value: 1 },
      { label: 'Por orden de llegada', value: 0 },
    ]),
    likert('q_hc_r5', 'assess_health_care', 'confidentiality', 'Comentar el diagnóstico de un paciente con un colega no tratante es incorrecto.', false, 103),
    likert('q_hc_r6', 'assess_health_care', 'confidentiality', 'Contar un caso interesante sin nombre no viola la confidencialidad.', true, 104),
    situational('q_hc_r7', 'assess_health_care', 'empathy', 'Un paciente llora al recibir su diagnóstico.', 'Qué haces:', [
      { label: 'Le cambio el tema rápido', value: 0 },
      { label: 'Lo acompaño, escucho y explico los siguientes pasos con calma', value: 1 },
      { label: 'Le digo que se calme, hay peores casos', value: 0 },
    ]),
    likert('q_hc_r8', 'assess_health_care', 'protocol', 'Sigo los protocolos de bioseguridad aunque el turno sea tranquilo.', false, 105),
    likert('q_hc_r9', 'assess_health_care', 'protocol', 'Los protocolos son para inspecciones, no para el día a día.', true, 106),
    situational('q_hc_r10', 'assess_health_care', 'ethics', 'Un familiar te pide información del paciente por teléfono sin autorización.', 'Qué haces:', [
      { label: 'Se la doy si suena preocupado', value: 0 },
      { label: 'Verifico autorización antes de dar cualquier información', value: 1 },
      { label: 'Depende de quién llame', value: 0 },
    ]),
  ],
}

async function main() {
  const assessments = await prisma.assessment.findMany({ select: { id: true } })
  const existing = new Set(assessments.map((a) => a.id))
  const counts = {}
  for (const [assessmentId, questions] of Object.entries(POOLS)) {
    if (!existing.has(assessmentId)) {
      console.log(`⚠️  Evaluación ${assessmentId} no existe en BD — omitida`)
      continue
    }
    for (const q of questions) {
      await prisma.question.upsert({
        where: { questionId: q.questionId },
        update: {
          text: q.text,
          options: q.options,
          reverseScored: q.reverseScored,
          scenario: q.scenario ?? null,
        },
        create: q,
      })
    }
    counts[assessmentId] = questions.length
    console.log(`✅ ${assessmentId}: +${questions.length} preguntas de rotación`)
  }
  console.log(JSON.stringify(counts))
}

main()
  .catch((e) => {
    console.error('ERROR:', e.message)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
