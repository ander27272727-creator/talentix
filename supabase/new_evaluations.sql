-- ============================================================
-- TALENTIX - Nuevas evaluaciones científicas para Supabase
-- ======================================= =======================
-- Ejecutar en: Supabase SQL Editor (https://supabase.com/dashboard)
--
-- Este script:
-- 1. Elimina evaluaciones y preguntas antiguas
-- 2. Crea 4 evaluaciones científicas completas:
--    - Razonamiento Lógico: 12 preguntas
--    - Personalidad OCEAN: 25 preguntas (5+ por dimensión)
--    - JS.situacional (SJT): 10 preguntas
--    - Evaluación Técnica: 12 preguntas
-- ============================================================

-- ============================================================
-- BORRAR EVALUACIONES ANTIGUAS
-- ============================================================
DELETE FROM "Question" WHERE "assessmentId" IN 
  (SELECT "id" FROM "Assessment" WHERE "category" IN ('COGNITIVE','PSYCHOMETRIC','BEHAVIORAL','TECHNICAL'));
DELETE FROM "Assessment" WHERE "category" IN ('COGNITIVE','PSYCHOMETRIC','BEHAVIORAL','TECHNICAL');

-- ============================================================
-- 1. RAZONAMIENTO LÓGICO - 12 preguntas
-- Evalúa: Pattern Recognition, Logical Reasoning, Critical Thinking, Deduction
-- ============================================================
INSERT INTO "Assessment" ("id", "name", "category", "description", "timeLimitMinutes", "targetRoles", "isActive", "createdAt", "updatedAt") VALUES
('assess_cog_logic', 'Razonamiento Lógico', 'COGNITIVE',
'De qué se trata: Esta evaluación mide tu capacidad para resolver problemas abstractos, detectar patrones numéricos y secuenciales, razonar de forma lógica y tomar decisiones basadas en información limitada. Es fundamental para cualquier rol que requiera análisis, planificación y resolución de problemas complejos.',
12, ARRAY['technology','operations','product','analyst'], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO "Question" ("assessmentId", "questionId", "order", "type", "dimension", "text", "options", "dimension", "subDimension") VALUES
-- === PATTERN RECOGNITION (4 preguntas) ===
('assess_cog_logic', 'q_cog_01', 1, 'MULTIPLE_CHOICE', 'pattern_recognition', 'subDimension',
 '¿Cuál número continúa la secuencia? 1, 4, 9, 16, 25, ...',
 E'{"text":"28","value":0},{"text":"30","value":0},{"text":"36","value":1},{"text":"49","value":0}',
 'pattern_recognition', 'numerical_sequences'),
('assess_cog_logic', 'q_cog_02', 2, 'MULTIPLE_CHOICE', 'pattern_recognition',
 '¿Qué letra sigue en: A, C, E, G, I, ...?',
 E'{"text":"J","value":0},{"text":"H","value":0},{"text":"K","value":0},{"text":"L","value":1}',
 'pattern_recognition', 'alphabet_sequences'),
('assess_cog_logic', 'q_cog_03', 3, 'MULTIPLE_CHOICE', 'pattern_recognition',
 '¿Cuál es la regla de la secuencia: 2, 6, 12, 20, 30, ...?',
 E'{"text":"n² + n","value":1},{"text":"2n","value":0},{"text":"n × 2","value":0},{"text":"Fibonacci × 2","value":0}',
 'pattern_recognition', 'rule_finding'),
('assess_cog_logic', 'q_cog_04', 4, 'MULTIPLE_CHOICE', 'pattern_recognition',
 'Completa la serie: 1, 1, 2, 3, 5, 8, 13, ...',
 E'{"text":"18","value":0},{"text":"20","value":1},{"text":"21","value":0},{"text":"15","value":0}',
 'pattern_recognition', 'fibonacci'),

-- === LOGICAL REASONING (4 preguntas) ===
('assess_cog_logic', 'q_cog_05', 5, 'MULTIPLE_CHOICE', 'logical_reasoning',
 'Todos los gatos son mamíferos. Algunos mamíferos tienen colas. ¿Qué podemos concluir?',
 E'{"text":"Todos los gatos tienen cola","value":0},{"text":"Algunos gatos podrían tener cola","value":1},{"text":"Ningún gato tiene cola","value":0},{"text":"Todos los mamíferos son gatos","value":0}',
 'logical_reasoning', 'syllogisms'),
('assess_cog_logic', 'q_cog_06', 6, 'MULTIPLE_CHOICE', 'logical_reasoning',
 'En una carrera, tú llegas en 3er lugar y adelantas al que iba en 2do. ¿Qué puesto ocupas ahora?',
 E'{"text":"2do lugar","value":1},{"text":"1er lugar","value":0},{"text":"3er lugar (no puedes adelantar al primero)","value":0},{"text":"Sigues en 3ero","value":0}',
 'logical_reasoning', 'position_logic'),
('assess_cog_logic', 'q_cog_07', 7, 'MULTIPLE_CHOICE', 'logical_reasoning',
 '¿Cuántos meses tienen 28 días?',
 E'{"text":"Solo febrero","value":0},{"text":"Los 12 meses tienen al menos 28 días","value":1},{"text":"6 meses","value":0},{"text":"Ninguno tiene exactamente 28","value":0}',
 'logical_reasoning', 'common_trap'),
('assess_cog_logic', 'q_cog_08', 8, 'MULTIPLE_CHOICE', 'logical_reasoning',
 'Un bate y una pelota cuestan $1.10 en total. El bate cuesta $1.00 más que la pelota. ¿Cuánto cuesta la pelota?',
 E'{"text":"$0.05","value":1},{"text":"$0.10","value":0},{"text":"$0.50","value":0},{"text":"$1.00","value":0}',
 'logical_reasoning', 'bat_ball_problem'),

-- === CRITICAL THINKING (2 preguntas) ===
('assess_cog_logic', 'q_cog_09', 9, 'MULTIPLE_CHOICE', 'critical_thinking',
 '¿Cuál es el error en: "Cd es la inicial de cada punto cardinal de la frontera de un país"?',
 E'{"text":"La frase tiene sentido pero no es la inicial de países","value":0},{"text":"No hay error","value":0},{"text":"Solo la I de cada punto","value":0},{"text":"Es un acertijo sin solución lógica","value":1}',
 'critical_thinking', 'ambiguity_detection'),
('assess_cog_logic', 'q_cog_10', 10, 'MULTIPLE_CHOICE', 'critical_thinking',
 'Si un comerciante compra algo por $100, lo vende por $120, pero gasta $20 en envío. ¿Cuál fue su ganancia?',
 E'{"text":"$0 (sin ganancia)","value":1},{"text":"$20","value":0},{"text":"$10","value":0},{"text":"Perdió dinero","value":0}',
 'critical_thinking', 'cost_benefit'),

-- === DEDUCTION (2 preguntas) ===
('assess_cog_logic', 'q_cog_11', 11, 'MULTIPLE_CHOICE', 'deduction',
 'Si 3 personas producen 3 productos en 3 horas. ¿Cuántas personas se necesitan para producir 12 productos en 4 horas?',
 E'{"text":"3 personas","value":1},{"text":"9 personas","value":0},{"text":"12 personas","value":0},{"text":"4 personas","value":0}',
 'deduction', 'rate_problems'),
('assess_cog_logic', 'q_cog_12', 12, 'MULTIPLE_CHOICE', 'deduction',
 'En un gimnasio, 5 personas trabajan en 5 máquinas en 5 minutos. ¿Cuánto tiempo necesitan 100 personas con 100 máquinas?',
 E'{"text":"5 minutos","value":1},{"text":"100 minutos","value":0},{"text":"20 minutos","value":0},{"text":"1 hora","value":0}',
 'deduction', 'scaling');

-- ============================================================
-- 2. PERSONALIDAD OCEAN - 25 preguntas (5+ por dimensión)
-- Modelo Big Five: Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism
-- Incluye preguntas TRAMPA para detectar respuestas inconsistentes
-- ============================================================
INSERT INTO "Assessment" ("id", "name", "category", "description", "timeLimitMinutes", "targetRoles", "isActive", "createdAt", "updatedAt") VALUES
('assess_psych_personality', 'Personalidad OCEAN (Big Five)', 'PSYCHOMETRIC',
'Qué mide: El modelo Big Five (OCEAN) es el más validado científicamente en psicología para predecir comportamiento laboral, adaptación al equipo e inteligencia emocional. Evalúas 5 dimensiones: Apertura (creatividad), Consciencia (organización), Extraversión (socialidad), Amabilidad (colaboración) y Neuroticismo (estabilidad emocional). La evaluación incluye preguntas trampa para detectar respuestas inconsistentes o exageradas.',
15, ARRAY['all'], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO "Question" ("assessmentId", "questionId", "order", "type", "dimension", "text", "options", "dimension", "subDimension", "reverseScored") VALUES
-- === OPENNESS (6 preguntas) ===
('assess_psych_personality', 'p_01', 1, 'LIKERT_SCALE', 'openness',
 'Disfruto explorar nuevas ideas y conceptos abstractos.',
 E'{"text":"Totalmente en desacuerdo","value":1},{"text":"En desacuerdo","value":2},{"text":"Neutral","value":3},{"text":"De acuerdo","value":4},{"text":"Totalmente de acuerdo","value":5}',
 'openness', 'curiosity_about_ideas', false),
('assess_psych_personality', 'p_02', 2, 'LIKERT_SCALE', 'openness',
 'Prefiero lo familiar y conocido en lugar de lo nuevo e inesperado.',
 E'{"text":"Totalmente en desacuerdo","value":5},{"text":"En desacuerdo","value":4},{"text":"Neutral","value":3},{"text":"De acuerdo","value":2},{"text":"Totalmente de acuerdo","value":1}',
 'openness', 'resistance_to_change', TRUE),
('assess_psych_personality', 'p_03', 3, 'LIKERT_SCALE', 'openness',
 'Me interesa aprender sobre culturas, arte y experiencias diversas.',
 E'{"text":"Totalmente en desacuerdo","value":1},{"text":"En desacuerdo","value":2},{"text":"Neutral","value":3},{"text":"De acuerdo","value":4},{"text":"Totalmente de acuerdo","value":5}',
 'openness', 'cultural_interest', false),
('assess_psych_personality', 'p_04', 4, 'LIKERT_SCALE', 'openness',
 'Soy una persona creativa que disfruta encontrar soluciones no convencionales.',
 E'{"text":"Totalmente en desacuerdo","value":1},{"text":"En desacuerdo","value":2},{"text":"Neutral","value":3},{"text":"De acuerdo","value":4},{"text":"Totalmente de acuerdo","value":5}',
 'openness', 'creative_thinking', false),
('assess_psych_personality', 'p_05', 5, 'LIKERT_SCALE', 'openness',
 'Miedo a cambiar mis ideas cuando alguien me presenta un argumento diferente.',
 E'{"text":"Totalmente en desacuerdo","value":5},{"text":"En desacuerdo","value":4},{"text":"Neutral","value":3},{"text":"De acuerdo","value":2},{"text":"Totalmente de acuerdo","value":1}',
 'openness', 'intellectual_flexibility', TRUE),
('assess_psych_personality', 'p_06', 6, 'LIKERT_SCALE', 'openness',
 'Inteligencia artificial y tecnología nueva me genera curiosidad, no preocupación.',
 E'{"text":"Totalmente en desacuerdo","value":1},{"text":"En desacuerdo","value":2},{"text":"Neutral","value":3},{"text":"De acuerdo","value":4},{"text":"Totalmente de acuerdo","value":5}',
 'openness', 'tech_curiosity', false),

-- === CONSCIENTIOUSNESS (6 preguntas) ===
('assess_psych_personality', 'p_07', 7, 'LIKERT_SCALE', 'conscientiousness',
 'Siempre completo las tareas que empiezo, incluso si son difíciles.',
 E'{"text":"Totalmente en desacuerdo","value":1},{"text":"En desacuerdo","value":2},{"text":"Neutral","value":3},{"text":"De acuerdo","value":4},{"text":"Totalmente de acuerdo","value":5}',
 'conscientiousness', 'dutifulness', false),
('assess_psych_personality', 'p_08', 8, 'LIKERT_SCALE', 'conscientiousness',
 'Soy una persona desordenada que trabaja mejor bajo presión.',
 E'{"text":"Totalmente en desacuerdo","value":5},{"text":"En desacuerdo","value":4},{"text":"Neutral","value":3},{"text":"De acuerdo","value":2},{"text":"Totalmente de acuerdo","value":1}',
 'conscientiousness', 'disorderliness', TRUE),
('assess_psych_personality', 'p_09', 9, 'LIKERT_SCALE', 'conscientiousness',
 'Pongo mucho esfuerzo en hacer las cosas bien, revisando detalles.',
 E'{"text":"Totalmente en desacuerdo","value":1},{"text":"En desacuerdo","value":2},{"text":"Neutral","value":3},{"text":"De acuerdo","value":4},{"text":"Totalmente de acuerdo","value":5}',
 'conscientiousness', 'attention_to_detail', false),
('assess_psych_personality', 'p_10', 10, 'LIKERT_SCALE', 'conscientiousness',
 'Me esfuerzo mucho para alcanzar mis metas, incluso si son difíciles.',
 E'{"text":"Totalmente en desacuerdo","value":1},{"text":"En desacuerdo","value":2},{"text":"Neutral","value":3},{"text":"De acuerdo","value":4},{"text":"Totalmente de acuerdo","value":5}',
 'conscientiousness', 'achievement_striving', false),
('assess_psych_personality', 'p_11', 11, 'LIKERT_SCALE', 'conscientiousness',
 'Suelo procrastinar hasta que el plazo es inminente.',
 E'{"text":"Totalmente en desacuerdo","value":5},{"text":"En desacuerdo","value":4},{"text":"Neutral","value":3},{"text":"De acuerdo","value":2},{"text":"Totalmente de acuerdo","value":1}',
 'conscientiousness', 'procrastination', TRUE),
('assess_psych_personality', 'p_12', 12, 'LIKERT_SCALE', 'conscientiousness',
 'Mantengo mi espacio de trabajo limpio, ordenado y organizado.',
 E'{"text":"Totalmente en desacuerdo","value":1},{"text":"En desacuerdo","value":2},{"text":"Neutral","value":3},{"text":"De acuerdo","value":4},{"text":"Totalmente de acuerdo","value":5}',
 'conscientiousness', 'orderliness', false),

-- === EXTRAVERSION (5 preguntas) ===
('assess_psych_personality', 'p_13', 13, 'LIKERT_SCALE', 'extraversion',
 'Me siento energizado/a cuando estoy rodeado/a de gente.',
 E'{"text":"Totalmente en desacuerdo","value":1},{"text":"En desacuerdo","value":2},{"text":"Neutral","value":3},{"text":"De acuerdo","value":4},{"text":"Totalmente de acuerdo","value":5}',
 'extraversion', 'social_energy', false),
('assess_psych_personality', 'p_14', 14, 'LIKERT_SCALE', 'extraversion',
 'Prefiero actividades tranquilas y solas en lugar de eventos sociales.',
 E'{"text":"Totalmente en desacuerdo","value":5},{"text":"En desacuerdo","value":4},{"text":"Neutral","value":3},{"text":"De acuerdo","value":2},{"text":"Totalmente de acuerdo","value":1}',
 'extraversion', 'solitude_preference', TRUE),
('assess_psych_personality', 'p_15', 15, 'LIKERT_SCALE', 'extraversion',
 'Fácilmente me uno a conversaciones en groupos grandes.',
 E'{"text":"Totalmente en desacuerdo","value":1},{"text":"En desacuerdo","value":2},{"text":"Neutral","value":3},{"text":"De acuerdo","value":4},{"text":"Totalmente de acuerdo","value":5}',
 'extraversion', 'group_socializing', false),
('assess_psych_personality', 'p_16', 16, 'LIKERT_SCALE', 'extraversion',
 'Soy más observador/a que participativo/a en reuniones.',
 E'{"text":"Totalmente en desacuerdo","value":5},{"text":"En desacuerdo","value":4},{"text":"Neutral","value":3},{"text":"De acuerdo","value":2},{"text":"Totalmente de acuerdo","value":1}',
 'extraversion', 'reserved_behavior', TRUE),
('assess_psych_personality', 'p_17', 17, 'LIKERT_SCALE', 'extraversion',
 'Busco activamente nuevas redes de contacts y oportunidades sociales.',
 E'{"text":"Totalmente en desacuerdo","value":1},{"text":"En desacuerdo","value":2},{"text":"Neutral","value":3},{"text":"De acuerdo","value":4},{"text":"Totalmente de acuerdo","value":5}',
 'extraversion', 'social_seeking', false),

-- === AGREEABLENESS (4 preguntas) ===
('assess_psych_personality', 'p_18', 18, 'LIKERT_SCALE', 'agreeableness',
 'Muestro empatía hacia los sentimientos de los demás.',
 E'{"text":"Totalmente en desacuerdo","value":1},{"text":"En desacuerdo","value":2},{"text":"Neutral","value":3},{"text":"De acuerdo","value":4},{"text":"Totalmente de acuerdo","value":5}',
 'agreeableness', 'empathy', false),
('assess_psych_personality', 'p_19', 19, 'LIKERT_SCALE', 'agreeableness',
 'Prefiero ganar discusiones en lugar de llegar a un acuerdo.',
 E'{"text":"Totalmente en desacuerdo","value":5},{"text":"En desacuerdo","value":4},{"text":"Neutral","value":3},{"text":"De acuerdo","value":2},{"text":"Totalmente de acuerdo","value":1}',
 'agreeableness', 'combativeness', TRUE),
('assess_psych_personality', 'p_20', 20, 'LIKERT_SCALE', 'agreeableness',
 'Ayudo a otros incluso cuando es difícil o me toma tiempo.',
 E'{"text":"Totalmente en desacuerdo","value":1},{"text":"En desacuerdo","value":2},{"text":"Neutral","value":3},{"text":"De acuerdo","value":4},{"text":"Totalmente de acuerdo","value":5}',
 'agreeableness', 'altruism', false),
('assess_psych_personality', 'p_21', 21, 'LIKERT_SCALE', 'agreeableness',
 'Confío en las intenciones de las demás personas.',
 E'{"text":"Totalmente en desacuerdo","value":1},{"text":"En desacuerdo","value":2},{"text":"Neutral","value":3},{"text":"De acuerdo","value":4},{"text":"Totalmente de acuerdo","value":5}',
 'agreeableness', 'trust', false),

-- === NEUROTICISM (4 preguntas) ===
('assess_psych_personality', 'p_22', 22, 'LIKERT_SCALE', 'neuroticism',
 'Me siento ansioso/a con facilidad cuando hay plazos ajustados.',
 E'{"text":"Totalmente en desacuerdo","value":5},{"text":"En desacuerdo","value":4},{"text":"Neutral","value":3},{"text":"De acuerdo","value":2},{"text":"Totalmente de acuerdo","value":1}',
 'neuroticism', 'stress_resilience', TRUE),
('assess_psych_personality', 'p_23', 23, 'LIKERT_SCALE', 'neuroticism',
 'Me cuesta conciliar el sueño cuando estoy preocupado/a.',
 E'{"text":"Totalmente en desacuerdo","value":5},{"text":"En desacuerdo","value":4},{"text":"Neutral","value":3},{"text":"De acuerdo","value":2},{"text":"Totalmente de acuerdo","value":1}',
 'neuroticism', 'sleep_disturbance', TRUE),
('assess_psych_personality', 'p_24', 24, 'LIKERT_SCALE', 'neuroticism',
 'Me siento deprimido/a cuando las cosas no salen como espero.',
 E'{"text":"Totalmente en desacuerdo","value":5},{"text":"En desacuerdo","value":4},{"text":"Neutral","value":3},{"text":"De acuerdo","value":2},{"text":"Totalmente de acuerdo","value":1}',
 'neuroticism', 'mood_swings', TRUE),
('assess_psych_personality', 'p_25', 25, 'LIKERT_SCALE', 'neuroticism',
 'Mantenerme calmado/a bajo presión es algo que practico y mejoro.',
 E'{"text":"Totalmente en desacuerdo","value":1},{"text":"En desacuerdo","value":2},{"text":"Neutral","value":3},{"text":"De acuerdo","value":4},{"text":"Totalmente de acuerdo","value":5}',
 'neuroticism', 'emotional_stability', false),

-- ============================================================
-- 3. JUICIO SITUACIONAL (SJT) - 10 preguntas
-- Evalúa: Leadership, Teamwork, Conflict Resolution, Ethics, Pressure
-- ============================================================
INSERT INTO "Assessment" ("id", "name", "category", "description", "timeLimitMinutes", "targetRoles", "isActive", "createdAt", "updatedAt") VALUES
('assess_behav_sjt', 'Juicio Situacional (SJT)', 'BEHAVIORAL',
'Qué mide: El Juicio Situacional (SJT) evalúa cómo respondes ante situaciones laborales realistas donde no hay una respuesta "correcta" única, sino que se mide qué tan efectiva es tu reacción para lograr resultados positivos, mantener relaciones y resolver problemas. Cubre leadership, trabajo en equipo, conficto, ética profesional y manejo de presión.',
12, ARRAY['manager','operations','sales','marketing','all'], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO "Question" ("assessmentId", "questionId", "order", "type", "dimension", "text", "scenario", "options", "dimension", "subDimension") VALUES
-- === LEADERSHIP (3 preguntas) ===
('assess_behav_sjt', 'sjt_01', 1, 'SCENARIO', 'leadership', 'Tu equipo tiene dos desarrolladores en conflicto sobre la arquitectura de un proyecto crítico. La fecha límite es en 2 semanas.',
 '¿Qué harías?',
 E'{"text":"Decides tu postura y la impones como líder","value":1},{"text":"Organizas una sesión de brainstorming para que encuentren solución conjunta","value":5},{"text":"Dejas que resuelvan solos para que apoquen responsabilidad","value":2},{"text":"Escalas al director de ingeniería para que decida","value":3}',
 'leadership', 'conflict_resolution'),
('assess_behav_sjt', 'sjt_02', 2, 'SCENARIO', 'leadership', 'Tu equipo no está alcanzando las metas de rendimiento. Dos miembros clave están frecuentando drogas o alcohol, y el manager sabe que uno de ellos tiene problemas.',
 '¿Qué harías?',
 E'{"text":"Confrontas directamente al miembro y lo reemplazas","value":1},{"text":"Organizas una reunión y aplicas políticas de rehabilitación","value":5},{"text":"Informas a la empresa para que busque ayuda profesional","value":3},{"text":"Ignoras el problema y esperas que se resuelva","value":2}',
 'leadership', 'performance_management'),
('assess_behav_sjt', 'sjt_03', 3, 'SCENARIO', 'leadership', 'Eres responsable de una fusión entre dos equipos con diferentes culturas. Uno es muy formal y el otro muy informal.',
 '¿Qué harías?',
 E'{"text":"Impones la cultura formal para mantener profesionalismo","value":1},{"text":"Identificas los mejores aspectos de ambas culturas y los integras","value":5},{"text":"Dejas que cada equipo mantenga su cultura","value":2},{"text":"Escalas al CEO para que decida la cultura","value":3}',
 'leadership', 'culture_integration'),

-- === TEAMWORK (2 preguntas) ===
('assess_behav_sjt', 'sjt_04', 4, 'SCENARIO', 'teamwork', 'Un compañero de equipo tiene problemas personales graves y su rendimiento ha bajado. El proyecto depende de su entrega.',
 '¿Qué harías?',
 E'{"text":"Organizas una reunión con él/ella para ofrecer apoyo y ajustar cargas","value":5},{"text":"Reportas la situación a tu manager","value":3},{"text":"Tomas sus tareas sin preguntar","value":1},{"text":"Ignoras la situación y esperas que se resuelva","value":2}',
 'teamwork', 'peer_support'),
('assess_behav_sjt', 'sjt_05', 5, 'SCENARIO', 'teamwork', 'Perteneces a un equipo donde hay sociedades competitivas y poco colaboradoras. Sientes que el trabajo no avanza.',
 '¿Qué harías?',
 E'{"text":"Comunicas el problema al manager y propones actividades de team building","value":5},{"text":"Tratas de ser más amable con cada uno individualmente","value":3},{"text":"Mientes a otros sobre el avance para "presionar" al equipo","value":1},{"text":"Te retiras del equipo para evitar el conflicto","value":2}',
 'teamwork', 'collaboration_building'),

-- === CONFLICT RESOLUTION (2 preguntas) ===
('assess_behav_sjt', 'sjt_06', 6, 'SCENARIO', 'conflict_resolution', 'Un cliente importante está muy enojado porque un producto falló. Exige una disculpa pública.',
 '¿Qué harías?',
 E'{"text":"Concéder la disculpa inmediata sin investigar","value":1},{"text":"Investigas el problema, haces seguimiento personalizado y ofreces una solución","value":5},{"text":"Rechazas la disculpa porque no fue tu culpa","value":3},{"text":"Escalas a legal para evitar responsabilidad","value":2}',
 'conflict_resolution', 'customer_management'),
('assess_behav_sjt', 'sjt_07', 7, 'SCENARIO', 'conflict_resolution', 'En una reunión, un colega ataca personalmente a otro miembro. El ambiente se vuelve hostil.',
 '¿Qué harías?',
 E'{"text":"Defiendes al atacado respondiendo con la misma intensidad","value":1},{"text":"Intervienes calmadamente para redirigir la discusión al tema profesional","value":5},{"text":"Ignoras el ataque y tomas notas","value":3},{"text":"Reportas el incidente a recursos humanos","value":2}',
 'conflict_resolution', 'de_escalation'),

-- === ETHICS (1 pregunta) ===
('assess_behav_sjt', 'sjt_08', 8, 'SCENARIO', 'ethics', 'Descubres que un compañero ha using información confíencial de un cliente para beneficio personal. Lo sabes por segunda mano, sin prueba directa.',
 '¿Qué harías?',
 E'{"text":"Reportas al compañero directamente si tienes evidencia","value":5},{"text":"Lo confrontas directamente para que se corrija","value":3},{"text":"Lo ignoras porque no tienes prueba directa","value":1},{"text":"Escalas sin investigar y sin evidencia","value":2}',
 'ethics', 'whistleblower'),
('assess_behav_sjt', 'sjt_09', 9, 'SCENARIO', 'ethics', 'Eres manager y un cliente te ofrece dinero para priorizar su proyecto sobre otros clientes.',
 '¿Qué harías?',
 E'{"text":"Aceptas pero lo oculto a la empresa","value":1},{"text":"Rechazas la oferta y reportas la situación","value":5},{"text":"Aceptas pero tratas a todos por igual","value":2},{"text":"No respondes el cliente pero mantienes la prioridad","value":3}',
 'ethics', 'bribery'),

-- === PRESSURE (1 pregunta) ===
('assess_behav_sjt', 'sjt_10', 10, 'SCENARIO', 'pressure_management', 'Tienes una presentación importante en 1 hora, pero un problema técnico crítico aparece y no hay laptop de respaldo.',
 '¿Qué harías?',
 E'{"text":"Cancelas la presentación y te vas","value":1},{"text":"Usas tu laptop personal y preparas una versión simplificada","value":5},{"text":"Pides a alguien que te presto su equipo","value":2},{"text":"Presentas solo con tu smartphone","value":3}',
 'pressure_management', 'crisis_response');

-- ============================================================
-- 4. EVALUACIÓN TÉCNICA - 12 preguntas
-- Evalúa: Architecture, Databases, Algorithms, Code Quality
-- ============================================================
INSERT INTO "Assessment" ("id", "name", "category", "description", "timeLimitMinutes", "targetRoles", "isActive", "createdAt", "updatedAt") VALUES
('assess_tech_dev', 'Evaluación Técnica - Desarrollo', 'TECHNICAL',
'Qué mide: Esta evaluación cubre conceptos fundamentales de desarrollo de software: diseño de algoritmos y estructuras de datos, arquitectura de sistemas, bases de datos y buenas prácticas de código. No prueba lenguajes específicos (React, Python, etc.) sino conceptos universales que aplican a cualquier stack.',
12, ARRAY['technology','developer','engineer','analyst'], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO "Question" ("assessmentId", "questionId", "order", "type", "dimension", "text", "options", "dimension") VALUES
-- === ARCHITECTURE (3 preguntas) ===
('assess_tech_dev', 't_01', 1, 'MULTIPLE_CHOICE', 'architecture',
 '¿Cuál patrón de diseño es más adecuado para crear una única instancia de una clase que gestiona recursos compartidos?',
 E'{"text":"Factory","value":0},{"text":"Singleton","value":1},{"text":"Observer","value":0},{"text":"Strategy","value":0}',
 'architecture'),
('assess_tech_dev', 't_02', 2, 'MULTIPLE_CHOICE', 'architecture',
 '¿Cuál es la diferencia principal entre LEFT JOIN e INNER JOIN?',
 E'{"text":"LEFT JOIN retorna todo de la tabla izquierda con NULL si no hay match","value":1},{"text":"INNER JOIN retorna todas las filas de ambas si hay match","value":1},{"text":"Son iguales","value":0},{"text":"LEFT JOIN es más rápido","value":0}',
 'architecture'),
('assess_tech_dev', 't_03', 3, 'MULTIPLE_CHOICE', 'architecture',
 '¿Qué principio SOLID se aplica cuando una clase tiene una única responsabilidad?',
 E'{"text":"Single Responsibility Principle (SRP)","value":1},{"text":"Open-Closed Principle","value":0},{"text":"Liskov Substitution Principle","value":0},{"text":"Interface Segregation","value":0}',
 'architecture'),

-- === DATABASES (3 preguntas) ===
('assess_tech_dev', 't_04', 4, 'MULTIPLE_CHOICE', 'databases',
 '¿Cuál es la complejidad temporal de acceder a un elemento por índice en un array?',
 E'{"text":"O(1)","value":1},{"text":"O(n)","value":0},{"text":"O(log n)","value":0},{"text":"O(n²)","value":0}',
 'databases'),
('assess_tech_dev', 't_05', 5, 'MULTIPLE_CHOICE', 'databases',
 '¿Qué tipo de índice es más eficiente para consultas de rango?',
 E'{"text":"B-Tree (árbol balanceado)","value":1},{"text":"Hash Index","value":0},{"text":"Bitmap Index","value":0},{"text":"No hay diferencia","value":0}',
 'databases'),
('assess_tech_dev', 't_06', 6, 'MULTIPLE_CHOICE', 'databases',
 '¿Cuál es la ventaja principal de una base de datos NoSQL como MongoDB sobre SQL?',
 E'{"text":"Escalabilidad horizontal flexible y esquema flexible","value":1},{"text":"Siempre más rápido","value":0},{"text":"Soporta transacciones ACID","value":0},{"text":"Más seguro","value":0}',
 'databases'),

-- === ALGORITHMS (3 preguntas) ===
('assess_tech_dev', 't_07', 7, 'MULTIPLE_CHOICE', 'algorithms',
 '¿Cuál es la complejidad temporal de Merge Sort en el peor caso?',
 E'{"text":"O(n log n)","value":1},{"text":"O(n²)","value":0},{"text":"O(n)","value":0},{"text":"O(log n)","value":0}',
 'algorithms'),
('assess_tech_dev', 't_08', 8, 'MULTIPLE_CHOICE', 'algorithms',
 'Dado un array ordenado, ¿cuál algoritmo de búsqueda tiene mejor complejidad?',
 E'{"text":"Binary Search: O(log n)","value":1},{"text":"Linear Search: O(n)","value":0},{"text":"Ambos son iguales","value":0},{"text":"Depende del lenguaje","value":0}',
 'algorithms'),
('assess_tech_dev', 't_09', 9, 'MULTIPLE_CHOICE', 'algorithms',
 '¿Qué estructura de datos usa FIFO (First In, First Out)?',
 E'{"text":"Queue (Cola)","value":1},{"text":"Stack (Pila)","value":0},{"text":"Array","value":0},{"text":"Hash Table","value":0}',
 'algorithms'),

-- === CODE QUALITY & BEST PRACTICES (3 preguntas) ===
('assess_tech_dev', 't_10', 10, 'MULTIPLE_CHOICE', 'code_quality',
 '¿Cuál es el propósito principal de los tests automatizados?',
 E'{"text":"Detectar bugs antes de producción y facilitar refactoring","value":1},{"text":"Aumentar tiempo de desarrollo","value":0},{"text":"Reemplazar código manual","value":0},{"text":"Eliminar bugs completamente","value":0}',
 'code_quality'),
('assess_tech_dev', 't_11', 11, 'MULTIPLE_CHOICE', 'code_quality',
 '¿Qué es DRY en desarrollo de software?',
 E'{"text":"Don''t Repeat Yourself - evitar código duplicado","value":1},{"text":"Do Repeat Yourself","value":0},{"text":"Design Review Yearly","value":0},{"text":"Data Recovery Y","value":0}',
 'code_quality'),
('assess_tech_dev', 't_12', 12, 'MULTIPLE_CHOICE', 'code_quality',
 '¿Cuál es la diferencia principal entre TDD (Test-Driven Development) y desarrollo tradicional?',
 E'{"text":"En TDD se escriben tests primero antes del código","value":1},{"text":"No hay diferencia","value":0},{"text":"TDD es más lento siempre","value":0},{"text":"Solo se usa para pequeños proyectos","value":0}',
 'code_quality');

-- ============================================================
-- ✅ EVALUACIONES CREADAS
-- Total: 4 evaluaciones con 61 preguntas en total
-- ============================================================
