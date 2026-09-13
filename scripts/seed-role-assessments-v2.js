process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Baterías de evaluación por tipo de empleo (fase 2).
// 1. Cobranzas           → branch: collections
// 2. Atención al Cliente → branch: customer_service
// 3. Vendedor de Tienda  → branch: retail_sales
// 4. Conductor           → branch: driver
// 5. Redactor/Contenido  → branch: writing
// 6. Seguridad           → branch: security
// Idempotente: upsert por questionId.

function likert(text, dimension, reverse = false) {
  return {
    type: 'LIKERT_SCALE', dimension, subDimension: dimension, text,
    options: [
      'Totalmente en desacuerdo', 'En desacuerdo', 'Neutral', 'De acuerdo', 'Totalmente de acuerdo',
    ].map(t => ({ text: t, value: 0 })),
    reverseScored: reverse,
  }
}

function situational(text, options, correctIdx, dimension, subDimension) {
  return {
    type: 'MULTIPLE_CHOICE', dimension, subDimension, text,
    options: options.map((t, i) => ({ text: t, value: i === correctIdx ? 1 : 0 })),
    reverseScored: false,
  }
}

// ==================== 1. COBRANZAS ====================
const COLLECTIONS_ID = 'assess_collections'
const COLLECTIONS_BRANCH = 'collections'
const COLLECTIONS_QUESTIONS = [
  situational(
    'Un cliente promete pagar "la próxima semana" por tercera vez. ¿Cuál es la mejor acción?',
    [
      'Confirmar un compromiso concreto: fecha, monto y medio de pago, y dejarlo registrado',
      'Colgar y volver a llamar la próxima semana sin acuerdos',
      'Amenazar con acciones inmediatas para presionar',
      'Aceptar el pago parcial sin registrarlo',
    ],
    0, 'negotiation', 'commitment', 2
  ),
  situational(
    'El cliente alega que nunca recibió el servicio que se le cobra. ¿Qué haces primero?',
    [
      'Escuchar el reclamo, verificar el historial en el sistema y escalar si corresponde',
      'Insistir en que debe pagar porque el sistema lo dice',
      'Cortar la llamada por información falsa',
      'Prometer anular la deuda para terminar el conflicto',
    ],
    0, 'negotiation', 'dispute_handling', 2
  ),
  situational(
    '¿Cuál es la diferencia clave entre negociar un plan de pagos y ofrecer una quita (descuento de capital)?',
    [
      'El plan reprograma la deuda completa; la quita condona una parte del capital',
      'Son lo mismo con nombres distintos',
      'El plan condona capital; la quita solo difiere fechas',
      'Ninguna afecta el monto que el cliente debe',
    ],
    0, 'collections_knowledge', 'payment_terms', 2
  ),
  situational(
    'Al llamar, la persona que contesta se molesta y te insulta. ¿Cuál es la conducta correcta?',
    [
      'Mantener la calma, no responder al insulto y ofrecer resolver el tema en otro momento',
      'Responder con la misma intensidad para que te respeten',
      'Repetir el mensaje de cobro sin escuchar',
      'Colgar de inmediato sin despedirte',
    ],
    0, 'stress_tolerance', 'hostile_contact', 2
  ),
  situational(
    '¿Qué información es correcta revelar en una llamada de cobranza?',
    [
      'Los datos de la deuda solo con el titular o autorizado, verificando identidad',
      'El detalle de la deuda a cualquier familiar que responda',
      'La deuda a vecinos o empleador para presionar',
      'Nada: nunca se puede hablar de la deuda con nadie',
    ],
    0, 'compliance', 'data_privacy', 2
  ),
  likert('Mantengo la compostura incluso cuando el cliente me trata con hostilidad.', 'stress_tolerance'),
  likert('Me resulta fácil pedir dinero o insistir en un compromiso, sin sentir que molesto.', 'negotiation'),
  likert('A veces postergo conversaciones difíciles sobre deudas porque me incomodan.', 'negotiation', true),
  situational(
    '¿Cuál de estas prácticas está PROHIBIDA en cobranza responsable?',
    [
      'Llamar a cualquier hora de la madrugada o usar amenazas',
      'Enviar recordatorios de pago por los canales autorizados',
      'Ofrecer facilidades de pago según política de la empresa',
      'Registrar el resultado de cada gestión de cobro',
    ],
    0, 'compliance', 'forbidden_practices', 2
  ),
  situational(
    'Tienes una cartera grande y tiempo limitado. ¿Cómo priorizas tus llamadas?',
    [
      'Por probabilidad de recuperación y monto: casos con historial de pago y deuda mayor primero',
      'Por orden alfabético de la lista',
      'Primero los más hostiles para resolverlos rápido',
      'Al azar para no sesgar el trabajo',
    ],
    0, 'results_orientation', 'portfolio_priority', 2
  ),
  likert('Persisto en obtener un compromiso de pago sin abandonar al primer "no".', 'results_orientation'),
  situational(
    'El cliente quiere pagar pero pide factura a nombre de otra persona. ¿Qué haces?',
    [
      'Explicar que la factura debe coincidir con el titular de la cuenta y verificar el procedimiento',
      'Aceptar sin verificar para no perder el pago',
      'Negar el pago hasta que lo haga el titular en persona',
      'Registrar el pago sin documentación',
    ],
    0, 'compliance', 'payment_integrity', 1
  ),
]

// ==================== 2. ATENCIÓN AL CLIENTE ====================
const CS_ID = 'assess_customer_service'
const CS_BRANCH = 'customer_service'
const CS_QUESTIONS = [
  situational(
    'Un cliente contacta muy enojado por un error de la empresa. ¿Qué haces PRIMERO?',
    [
      'Escuchar sin interrumpir, disculparte por el inconveniente y enfocarte en la solución',
      'Explicar de inmediato por qué no es culpa de la empresa',
      'Pedirle que se calme antes de continuar',
      'Transferirlo a otra área lo antes posible',
    ],
    0, 'service_orientation', 'angry_customer', 2
  ),
  situational(
    'El cliente pide algo que no puedes autorizar. ¿Cuál es la mejor respuesta?',
    [
      'Explicar el límite con claridad y ofrecer la mejor alternativa que sí está a tu alcance',
      'Inventar una excepción para quedar bien',
      'Decir "no se puede" y terminar el contacto',
      'Dejarlo en espera indefinidamente',
    ],
    0, 'service_orientation', 'limits_alternatives', 2
  ),
  situational(
    'Explica un trámite complejo a una persona mayor. ¿Cuál es la mejor forma?',
    [
      'Con pasos simples, en orden, confirmando que entendió antes de avanzar',
      'Con toda la información de golpe para no alargar',
      'Con términos técnicos para demostrar dominio',
      'Dejándole un número para que llame después',
    ],
    0, 'communication_clarity', 'plain_explanations', 2
  ),
  situational(
    'Detectas que la consulta se repite mucho entre clientes. ¿Qué haces?',
    [
      'Reportarlo al equipo para crear una respuesta o guía estándar',
      'Nada: responder cada caso individual es tu única tarea',
      'Responder más rápido aunque la respuesta sea la misma',
      'Ignorarlo porque no es tu área',
    ],
    0, 'process_improvement', 'feedback_loop', 1
  ),
  situational(
    'El canal de chat acumula varias conversaciones a la vez. ¿Cómo las manejas?',
    [
      'Priorizando por urgencia, con respuestas breves y avisando tiempos de espera',
      'Atendiendo solo la primera y dejando el resto sin respuesta',
      'Copiando la misma respuesta a todos sin leer',
      'Cerrando chats para reducir la carga',
    ],
    0, 'multichannel', 'chat_load', 2
  ),
  likert('Me gusta ayudar a las personas incluso cuando la consulta es repetitiva.', 'service_orientation'),
  likert('Mantengo un tono amable aunque el cliente me trate mal.', 'stress_tolerance'),
  likert('Cuando estoy cansado, mi trato con los clientes se nota más corto.', 'stress_tolerance', true),
  situational(
    'El cliente amenaza con publicar una queja en redes sociales. ¿Cuál es la actitud correcta?',
    [
      'Tratar el caso con el mismo estándar: resolver el problema real, sin ceder a la presión',
      'Ofrecer compensaciones extras solo para evitar la publicación',
      'Ignorar la amenaza y responder con frialdad',
      'Pedirle que no publique antes de atender su caso',
    ],
    0, 'service_orientation', 'escalation_pressure', 1
  ),
  situational(
    '¿Qué es lo MÁS importante al cerrar una interacción de soporte?',
    [
      'Confirmar que la consulta quedó resuelta y que no tiene más dudas',
      'Terminar rápido para atender al siguiente',
      'Registrar solo si el cliente se quejó',
      'Ofrecer siempre un descuento',
    ],
    0, 'service_orientation', 'closure_quality', 2
  ),
]

// ==================== 3. VENDEDOR DE TIENDA ====================
const RETAIL_ID = 'assess_retail_sales'
const RETAIL_BRANCH = 'retail_sales'
const RETAIL_QUESTIONS = [
  situational(
    'Un cliente entra y mira un producto sin pedir ayuda. ¿Cuál es el mejor enfoque?',
    [
      'Acercarte con naturalidad, ofrecer ayuda y hacer una pregunta abierta sobre lo que busca',
      'Seguirlo de cerca para no perder la venta',
      'Dejarlo solo todo el tiempo en la tienda',
      'Presionarlo con el precio de inmediato',
    ],
    0, 'customer_approach', 'approach', 2
  ),
  situational(
    'El cliente compara tu producto con uno más barato de la competencia. ¿Qué haces?',
    [
      'Destacar el valor, garantía y servicio que justifican la diferencia',
      'Bajar el precio sin autorización',
      'Decir que el de la competencia es de mala calidad sin fundamento',
      'Decir que no hay diferencia y dejar que decida solo',
    ],
    0, 'product_knowledge', 'value_selling', 2
  ),
  situational(
    'No tienes en stock el producto exacto que pide. ¿Cuál es la mejor acción?',
    [
      'Ofrecer alternativas similares, verificar llegada de stock o tomar pedido con entrega',
      'Decir "no hay" y cambiar de tema',
      'Venderle otro producto sin advertir la diferencia',
      'Pedirle que busque en otra tienda sin más ayuda',
    ],
    0, 'product_knowledge', 'stock_management', 2
  ),
  situational(
    'Cierres la venta. ¿Cuál es el siguiente paso profesional?',
    [
      'Confirmar la compra, ofrecer productos complementarios útiles y cuidar la despedida',
      'Entregar y despedir rápido, hay fila',
      'Presionar con más productos hasta que compre otros',
      'Pedirle que recomiende la tienda a gritos',
    ],
    0, 'closing_service', 'upsell_balance', 1
  ),
  situational(
    'Dos clientes te llaman al mismo tiempo en distintos mostradores. ¿Qué haces?',
    [
      'Reconocer a ambos, atender primero a uno y pedirle un instante al otro con cortesía',
      'Atender al que grita más fuerte',
      'Atender solo al primero e ignorar al segundo',
      'Llamar a seguridad para controlar la situación',
    ],
    0, 'customer_approach', 'prioritization_floor', 2
  ),
  likert('Me siento cómodo iniciando conversaciones con desconocidos en el piso de venta.', 'customer_approach'),
  likert('Aporto ideas de exhibición y orden cuando veo que algo puede vender mejor.', 'merchandising'),
  likert('Prefiero evitar el contacto con clientes y quedarme en tareas de depósito.', 'customer_approach', true),
  situational(
    'Detectas a una persona con conducta sospechosa de hurto. ¿Qué haces?',
    [
      'Avisar discretamente al encargado o seguridad según protocolo, sin confrontar',
      'Confrontarlo directamente para asustarlo',
      'Ignorarlo porque no es tu problema',
      'Gritar para alertar a todos los clientes',
    ],
    0, 'loss_prevention', 'suspicious_behavior', 2
  ),
  situational(
    'Se acerca el cierre y te piden armar la exhibición de mañana. ¿Cuál es la prioridad?',
    [
      'Terminar de atender bien a los clientes presentes y luego armar la exhibición según instrucciones',
      'Dejar a los clientes y armar la exhibición de una vez',
      'Armar la exhibición a medias y retirarte',
      'Pedir a un cliente que vuelva mañana para poder cerrar antes',
    ],
    0, 'work_ethics', 'closing_routine', 1
  ),
]

// ==================== 4. CONDUCTOR ====================
const DRIVER_ID = 'assess_driver'
const DRIVER_BRANCH = 'driver'
const DRIVER_QUESTIONS = [
  situational(
    'Tienes prisa por una entrega y el semáforo lleva mucho tiempo en amarillo al aproximarte. ¿Qué haces?',
    [
      'Frenar y esperar: ninguna entrega justifica arriesgar un cruce inseguro',
      'Acelerar para pasar antes del rojo',
      'Pasar despacio mirando a ambos lados',
      'Depende de si hay cámaras',
    ],
    0, 'safe_driving', 'traffic_rules', 2
  ),
  situational(
    'Empieza a llover fuerte durante tu ruta. ¿Qué ajuste haces?',
    [
      'Reducir velocidad, aumentar la distancia con el vehículo de adelante y encender luces',
      'Mantener la misma velocidad porque conoces la ruta',
      'Acelerar para llegar antes a la lluvia',
      'Conducir cerca de otros vehículos para guiarte',
    ],
    0, 'safe_driving', 'weather_adaptation', 2
  ),
  situational(
    'El cliente receptor del paquete no está en la dirección. ¿Cuál es el procedimiento correcto?',
    [
      'Registrar el intento, avisar según protocolo y seguir las instrucciones de la empresa para reprogramar',
      'Dejar el paquete en la puerta sin autorización',
      'Entregarlo a cualquier vecino para no volver',
      'Regresar a la base y abandonar la entrega',
    ],
    0, 'delivery_procedure', 'failed_delivery', 2
  ),
  situational(
    'Notas un ruido anormal en los frenos antes de iniciar la ruta. ¿Qué haces?',
    [
      'No iniciar la ruta y reportarlo de inmediato para revisión',
      'Iniciar igual y reportarlo al final del día',
      'Conducir más despacio y seguir',
      'Ignorarlo si el vehículo arranca bien',
    ],
    0, 'vehicle_care', 'pre_trip_checks', 2
  ),
  situational(
    'Otro conductor te hace una maniobra peligrosa y te insulta. ¿Cuál es la actitud correcta?',
    [
      'No responder, mantener distancia y concentrarte en tu conducción',
      'Responder al insulto y reclamarle',
      'Persuadirlo para explicarle su error',
      'Bloquearle el paso como reclamación',
    ],
    0, 'stress_tolerance', 'road_rage', 2
  ),
  likert('Cumplo los límites de velocidad incluso cuando voy atrasado.', 'safe_driving'),
  likert('Reviso el vehículo (neumáticos, luces, combustible) antes de cada ruta.', 'vehicle_care'),
  likert('A veces uso el celular mientras conduzco si es solo para coordinar entregas.', 'safe_driving', true),
  situational(
    'Te asignan una carga que excede el peso autorizado. ¿Qué haces?',
    [
      'Informar la situación y no circular sobrecargado hasta que se corrija',
      'Cargar y circular con cuidado por rutas sin controles',
      'Circular solo tramos cortos con el exceso',
      'Distribuir el peso y salir igual',
    ],
    0, 'compliance', 'load_limits', 2
  ),
  situational(
    'El cliente recibe la entrega tarde y te reclama con enojo. ¿Cuál es la mejor respuesta?',
    [
      'Disculparte por el inconveniente, explicar con honestidad y registrar el reclamo',
      'Culpar al tráfico o a la empresa sin más',
      'Argumentar que no es tu responsabilidad',
      'Retirar el paquete en señal de protesta',
    ],
    0, 'customer_service_delivery', 'complaint_handling', 1
  ),
]

// ==================== 5. REDACTOR / CONTENIDO ====================
const WRITING_ID = 'assess_writing'
const WRITING_BRANCH = 'writing'
const WRITING_QUESTIONS = [
  situational(
    '¿Cuál de estas oraciones está mejor redactada?',
    [
      'El equipo presentó los resultados del trimestre al comité.',
      'Los resultados del trimestre fueron presentados al comité por el equipo.',
      'Se presentaron por el equipo al comité los resultados.',
      'El equipo, presentó resultados al comité del trimestre.',
    ],
    0, 'grammar_style', 'clarity', 2
  ),
  situational(
    'Tu tarea: un post para redes sobre un curso de cocina. ¿Qué estructura funciona mejor?',
    [
      'Gancho que atraiga, beneficio claro para el lector y llamado a la acción',
      'Historia larga de la empresa y al final el curso',
      'Lista de características técnicas sin contexto',
      'Solo el precio y un enlace',
    ],
    0, 'content_strategy', 'structure', 2
  ),
  situational(
    'Te piden un artículo en 300 palabras y lo que enviaste son 600. ¿Qué haces?',
    [
      'Recortar priorizando la idea principal y eliminar relleno, respetando el límite',
      'Entregar las 600 porque el contenido es bueno',
      'Reducir la letra y los márgenes para que "entre"',
      'Entregar a medias sin conclusión',
    ],
    0, 'work_ethics', 'brief_compliance', 1
  ),
  situational(
    'Encuentras un dato perfecto en un blog, pero sin fuente original. ¿Qué haces?',
    [
      'Buscar la fuente primaria y citarla; si no aparece, no usar el dato',
      'Usarlo citando el blog que lo copió',
      'Usarlo sin citar a nadie',
      'Cambiar el dato ligeramente para que "sea propio"',
    ],
    0, 'ethics_research', 'source_verification', 2
  ),
  situational(
    'El cliente rechaza tu texto con "no me convence, no sé por qué". ¿Cuál es la mejor acción?',
    [
      'Pedir ejemplos o referencias de lo que sí le gusta y presentar una versión ajustada',
      'Reenviar el mismo texto con otro formato',
      'Insistir en que tu versión es mejor',
      'Entregar dos versiones nuevas sin preguntar nada',
    ],
    0, 'feedback_handling', 'vague_feedback', 2
  ),
  likert('Reviso mi propio texto varias veces antes de entregarlo.', 'work_ethics'),
  likert('Me adapto a escribir en tonos distintos (formal, cercano, publicitario) según el medio.', 'versatility'),
  likert('Escribo mejor cuando me dejan hacerlo a mi manera, sin pautas ni límites.', 'work_ethics', true),
  situational(
    '¿Cuál es el error en: "A las personas que le gustó el evento, se le envió la encuesta"?',
    [
      'Concordancia: "a las personas que les gustó... se les envió"',
      'Ninguno, está correcto',
      'La coma antes de "se le envió"',
      'El uso de "encuesta"',
    ],
    0, 'grammar_style', 'agreement', 2
  ),
  situational(
    'Para el blog de una empresa, ¿qué título genera más tráfico orgánico?',
    [
      'Cómo elegir software de facturación: guía con errores comunes y ejemplos',
      'Software de facturación',
      'Nuestro software es el mejor',
      'Artículo sobre facturación',
    ],
    0, 'content_strategy', 'seo_titles', 1
  ),
]

// ==================== 6. SEGURIDAD ====================
const SECURITY_ID = 'assess_security'
const SECURITY_BRANCH = 'security'
const SECURITY_QUESTIONS = [
  situational(
    'Ves a una persona forcejeando con otra dentro del predio. ¿Cuál es la primera acción?',
    [
      'Activar el protocolo: alertar por radio, acercarse con seguridad y separar sin agresión',
      'Intervenir físicamente con fuerza para dominar al agresor',
      'Observar sin hacer nada hasta que termine',
      'Grabar con el celular y publicarlo',
    ],
    0, 'response_protocol', 'intervention', 2
  ),
  situational(
    'Detectas una puerta de emergencia abierta en tu ronda. ¿Qué haces?',
    [
      'Asegurar la puerta, verificar la causa y reportar el hallazgo en la bitácora',
      'Cerrarla y seguir la ronda sin anotar nada',
      'Anotarlo al final del turno sin revisarla',
      'Avisar al siguiente turno y no intervenir',
    ],
    0, 'vigilance', 'patrol_thoroughness', 2
  ),
  situational(
    'Un visitante sin credencial insiste en pasar por una reunión urgente. ¿Qué haces?',
    [
      'No permitir el acceso, verificar con el anfitrión por los canales oficiales y registrar el episodio',
      'Dejarlo pasar por la urgencia que alega',
      'Negar el acceso sin verificar nada',
      'Pedirle una propina para dejarlo pasar',
    ],
    0, 'access_control', 'visitor_policy', 2
  ),
  situational(
    '¿Qué información debe contener SIEMPRE un reporte de incidente?',
    [
      'Qué pasó, cuándo, dónde, quiénes intervinieron y las acciones tomadas',
      'Solo la fecha y una frase corta',
      'Tu opinión sobre quién tiene la culpa',
      'Nada: los incidentes se cuentan de palabra',
    ],
    0, 'reporting', 'incident_reports', 2
  ),
  situational(
    'Suena la alarma de incendios durante tu turno. ¿Cuál es tu función principal?',
    [
      'Guiar la evacuación por las salidas seguras y verificar zonas asignadas según protocolo',
      'Salir tú primero para asegurar tu integridad',
      'Buscar la causa del incendio antes que nada',
      'Esperar instrucciones sin actuar',
    ],
    0, 'emergency_response', 'evacuation', 2
  ),
  likert('Mantengo la atención incluso en turnos largos y monótonos.', 'vigilance'),
  likert('Puedo mantener la calma y actuar con criterio bajo presión.', 'emergency_response'),
  likert('Creo que algunas reglas de seguridad pueden saltarse si el turno va tranquilo.', 'vigilance', true),
  situational(
    'Un directivo de la empresa te pide pasar sin registro porque "va apurado". ¿Qué haces?',
    [
      'Aplicar el protocolo igual: registrar el acceso con cortesía y sin excepciones',
      'Dejarlo pasar por su jerarquía',
      'Pedirle autorización por escrito cada vez que ocurra',
      'Dejarlo pasar pero anotando que fue excepción del directivo',
    ],
    0, 'integrity_ethics', 'no_exceptions', 2
  ),
  situational(
    '¿Cuál es la mejor forma de disuadir un conflicto antes de que escale?',
    [
      'Contacto visual, tono firme y sereno, distancia prudente y comunicación clara',
      'Gritar para imponer autoridad',
      'Actuar como si no vieras el conflicto',
      'Amenazar con llamar a la policía de inmediato',
    ],
    0, 'deescalation', 'conflict_prevention', 2
  ),
]

// ==================== SEED ====================
async function seedOne(id, name, description, timeLimit, targetRoles, branch, questions, prefix) {
  await prisma.assessment.upsert({
    where: { id },
    update: {
      name, category: 'TECHNICAL', description, timeLimitMinutes: timeLimit,
      targetRoles, careerBranch: branch, isActive: true,
    },
    create: {
      id, name, category: 'TECHNICAL', description, timeLimitMinutes: timeLimit,
      targetRoles, careerBranch: branch, isActive: true,
    },
  })
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i]
    const questionId = `${prefix}_${String(i + 1).padStart(2, '0')}`
    await prisma.question.upsert({
      where: { questionId },
      update: { assessmentId: id, text: q.text, options: JSON.stringify(q.options), dimension: q.dimension, subDimension: q.subDimension, reverseScored: q.reverseScored, order: i + 1, careerBranch: branch },
      create: { assessmentId: id, questionId, order: i + 1, type: q.type, text: q.text, options: JSON.stringify(q.options), dimension: q.dimension, subDimension: q.subDimension, reverseScored: q.reverseScored, careerBranch: branch },
    })
  }
  return questions.length
}

async function main() {
  console.log('📥 Creando baterías de evaluación por empleo (fase 2)...')
  const nColl = await seedOne(
    COLLECTIONS_ID,
    'Cobranzas y Recuperación de Crédito',
    'Evalúa tus aptitudes para cobranzas: negociación de compromisos de pago, manejo de objeciones y disputas, tolerancia al rechazo, cumplimiento de normas de trato y priorización de cartera. Clave para roles de cobranza telefónica y presencial.',
    12,
    ['Cobranzas', 'Crédito y Cobranza', 'Recuperación', 'Call Center de Cobranza'],
    COLLECTIONS_BRANCH, COLLECTIONS_QUESTIONS, 'q_coll'
  )
  const nCs = await seedOne(
    CS_ID,
    'Atención al Cliente y Soporte',
    'Evalúa tu orientación al servicio: manejo de clientes difíciles, comunicación clara, límites y alternativas, trabajo multicanal (chat, teléfono, correo) y cierre de calidad de cada interacción. Esencial para soporte, help desk y servicio postventa.',
    10,
    ['Atención al Cliente', 'Soporte', 'Servicio al Cliente', 'Help Desk', 'Postventa'],
    CS_BRANCH, CS_QUESTIONS, 'q_cs'
  )
  const nRet = await seedOne(
    RETAIL_ID,
    'Vendedor de Tienda y Retail',
    'Evalúa tus habilidades para el piso de venta: abordaje al cliente, venta de valor frente a la competencia, manejo de stock y alternativas, exhibición, prevención de pérdidas y equilibrio entre venta y servicio. Para tiendas, retail y comercios.',
    10,
    ['Vendedor de Tienda', 'Retail', 'Comercio', 'Asesor Comercial', 'Tiendas'],
    RETAIL_BRANCH, RETAIL_QUESTIONS, 'q_ret'
  )
  const nDrv = await seedOne(
    DRIVER_ID,
    'Conducción Segura y Entregas',
    'Evalúa tu criterio al volante y en la ruta: respeto de normas, adaptación al clima, cuidado y revisión del vehículo, procedimientos de entrega, manejo del estrés vial y servicio ante reclamos. Para conductores, repartidores y logística de última milla.',
    10,
    ['Conductor', 'Repartidor', 'Delivery', 'Logística', 'Chofer'],
    DRIVER_BRANCH, DRIVER_QUESTIONS, 'q_drv'
  )
  const nWrt = await seedOne(
    WRITING_ID,
    'Redacción y Creación de Contenido',
    'Evalúa tu capacidad de redacción: claridad y gramática, estructura de contenidos para medios digitales, adaptación a la pauta, verificación de fuentes, manejo de feedback y versatilidad de tono. Para redactores, community managers y creadores de contenido.',
    10,
    ['Redactor', 'Content Writer', 'Community Manager', 'Copywriter', 'Contenido'],
    WRITING_BRANCH, WRITING_QUESTIONS, 'q_wrt'
  )
  const nSec = await seedOne(
    SECURITY_ID,
    'Seguridad y Vigilancia',
    'Evalúa tu aptitud para seguridad física: protocolos de intervención, control de accesos, redacción de reportes, respuesta a emergencias, desescalada de conflictos e integridad ante excepciones. Para vigiladores, guardias y seguridad privada.',
    10,
    ['Seguridad', 'Vigilancia', 'Guardia', 'Vigilador', 'Portería'],
    SECURITY_BRANCH, SECURITY_QUESTIONS, 'q_sec'
  )
  console.log('✅ Baterías creadas:')
  console.log(`   - cobranzas: ${nColl} preguntas`)
  console.log(`   - atención al cliente: ${nCs} preguntas`)
  console.log(`   - vendedor de tienda: ${nRet} preguntas`)
  console.log(`   - conductor: ${nDrv} preguntas`)
  console.log(`   - redacción: ${nWrt} preguntas`)
  console.log(`   - seguridad: ${nSec} preguntas`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
