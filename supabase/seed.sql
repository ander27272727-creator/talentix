-- ============================================================
-- TALENTIX - Datos Iniciales para Supabase
-- Ejecutar DESPUÉS de schema.sql
-- ============================================================

-- ============================================================
-- 1. PLANES DE PRECIO
-- ============================================================
INSERT INTO "PlanPricing" ("id", "plan", "name", "description", "monthlyPrice", "annualPrice", "maxVacancies", "maxCandidates", "maxAssessments", "hasAPIAccess", "hasCustomAssess", "hasAnalytics", "hasExport", "hasDedicatedCSM", "isActive", "createdAt", "updatedAt") VALUES
('plan_trial', 'TRIAL', 'Prueba', '14 días gratis. 1 vacante, 5 candidatos.', 0.00, 0.00, 1, 5, 10, false, false, false, false, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('plan_starter', 'STARTER', 'Starter', 'Para empresas pequeñas que inician su búsqueda de talento.', 199.00, 1990.00, 3, 30, 100, false, false, true, false, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('plan_professional', 'PROFESSIONAL', 'Professional', 'Para empresas en crecimiento con necesidades de reclutamiento activas.', 599.00, 5990.00, 10, 100, 500, true, true, true, true, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('plan_enterprise', 'ENTERPRISE', 'Enterprise', 'Solución completa para grandes organizaciones.', 1499.00, 14990.00, 30, 500, -1, true, true, true, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('plan_custom', 'CUSTOM', 'Personalizado', 'Plan a medida según las necesidades de la empresa.', 0.00, 0.00, 0, 0, 0, true, true, true, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ============================================================
-- 2. USUARIOS DEMO
-- ============================================================

-- Admin principal (password: admin123 - hash bcrypt)
INSERT INTO "User" ("id", "email", "passwordHash", "name", "role", "createdAt", "updatedAt") VALUES
('usr_admin01', 'admin@talentix.com', '$2b$10$rQZ8kEfOQQjMKE3fhjHuZOxR5lZh2fB.vJL7QzI0eO9T/K1zC5b8e', 'Administrador Talentix', 'ADMIN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Candidato demo 1
INSERT INTO "User" ("id", "email", "passwordHash", "name", "role", "createdAt", "updatedAt") VALUES
('usr_cand01', 'maria.garcia@email.com', '$2b$10$rQZ8kEfOQQjMKE3fhjHuZOxR5lZh2fB.vJL7QzI0eO9T/K1zC5b8e', 'María García', 'CANDIDATE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO "CandidateProfile" ("id", "userId", "bio", "location", "phone", "skills", "createdAt", "updatedAt") VALUES
('cand01', 'usr_cand01', 'Ingeniera de Software con 5 años de experiencia en React, Node.js y arquitecturas cloud. Apasionada por crear productos que impacten vidas.', 'Ciudad de México, México', '+52 55 1234 5678', ARRAY['React', 'Node.js', 'TypeScript', 'AWS', 'PostgreSQL', 'Docker', 'GraphQL'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO "Education" ("id", "candidateId", "institution", "degree", "field", "startDate", "endDate", "current") VALUES
('edu01', 'cand01', 'Universidad Nacional Autónoma de México (UNAM)', 'Ingeniería en Sistemas Computacionales', 'Ingeniería', '2016-08-01', '2020-06-30', false);

INSERT INTO "Experience" ("id", "candidateId", "company", "position", "description", "startDate", "endDate", "current", "skills") VALUES
('exp01', 'cand01', 'TechCorp Solutions', 'Desarrolladora Full Stack Senior', 'Liderazgo de equipo de 5 desarrolladores. Migración de monolito a microservicios.', '2021-03-01', '2024-12-31', false, ARRAY['React', 'Node.js', 'AWS', 'Docker']),
('exp02', 'cand01', 'Startup MX', 'Desarrolladora Frontend', 'Desarrollo de SPA con React y TypeScript para plataforma fintech.', '2020-01-15', '2021-02-28', false, ARRAY['React', 'TypeScript', 'Redux']);

-- Candidato demo 2
INSERT INTO "User" ("id", "email", "passwordHash", "name", "role", "createdAt", "updatedAt") VALUES
('usr_cand02', 'carlos.ruiz@email.com', '$2b$10$rQZ8kEfOQQjMKE3fhjHuZOxR5lZh2fB.vJL7QzI0eO9T/K1zC5b8e', 'Carlos Ruiz', 'CANDIDATE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO "CandidateProfile" ("id", "userId", "bio", "location", "phone", "skills", "createdAt", "updatedAt") VALUES
('cand02', 'usr_cand02', 'Licenciado en Administración de Empresas con enfoque en Recursos Humanos y gestión del talento.', 'Bogotá, Colombia', '+57 310 123 4567', ARRAY['Gestión de Talento', 'Reclutamiento', 'HR Analytics', 'Excel', 'LinkedIn Recruiter', 'Workday'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO "Education" ("id", "candidateId", "institution", "degree", "field", "startDate", "endDate", "current") VALUES
('edu02', 'cand02', 'Universidad de los Andes', 'Administración de Empresas', 'Administración', '2015-08-01', '2019-12-15', false);

INSERT INTO "Experience" ("id", "candidateId", "company", "position", "description", "startDate", "endDate", "current", "skills") VALUES
('exp03', 'cand02', 'GlobalTech Corp', 'Gerente de RRHH', 'Gestión de 200+ empleados. Implementación de programa de bienestar laboral.', '2020-06-01', NULL, true, ARRAY['Reclutamiento', 'Gestión de Talento', 'HR Analytics']);

-- Candidato demo 3
INSERT INTO "User" ("id", "email", "passwordHash", "name", "role", "createdAt", "updatedAt") VALUES
('usr_cand03', 'ana.martinez@email.com', '$2b$10$rQZ8kEfOQQjMKE3fhjHuZOxR5lZh2fB.vJL7QzI0eO9T/K1zC5b8e', 'Ana Martínez', 'CANDIDATE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO "CandidateProfile" ("id", "userId", "bio", "location", "phone", "skills", "createdAt", "updatedAt") VALUES
('cand03', 'usr_cand03', 'Diseñadora UX/UI con 4 años de experiencia creando interfaces intuitivas y centradas en el usuario.', 'Madrid, España', '+34 612 345 678', ARRAY['Figma', 'Sketch', 'Adobe XD', 'Prototyping', 'User Research', 'Design Systems'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ============================================================
-- 3. EMPRESAS DEMO
-- ============================================================

INSERT INTO "User" ("id", "email", "passwordHash", "name", "role", "createdAt", "updatedAt") VALUES
('usr_comp01', 'rrhh@techcorp.com', '$2b$10$rQZ8kEfOQQjMKE3fhjHuZOxR5lZh2fB.vJL7QzI0eO9T/K1zC5b8e', 'TechCorp Solutions', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO "Company" ("id", "name", "industry", "size", "description", "website", "location", "culture", "benefits", "plan", "planExpiresAt", "trialUsed", "userId", "createdAt", "updatedAt") VALUES
('comp01', 'TechCorp Solutions', 'Tecnología', '51-200', 'Empresa líder en desarrollo de software empresarial. Soluciones cloud, IA y transformación digital.', 'https://techcorp.com', 'Ciudad de México, México', ARRAY['Innovación', 'Trabajo en equipo', 'Flexibilidad', 'Aprendizaje continuo'], ARRAY['Home office', 'Seguro médico', 'Capacitación', 'Horario flexible'], 'PROFESSIONAL', CURRENT_TIMESTAMP + INTERVAL '30 days', true, 'usr_comp01', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO "User" ("id", "email", "passwordHash", "name", "role", "createdAt", "updatedAt") VALUES
('usr_comp02', 'talento@globaltech.com', '$2b$10$rQZ8kEfOQQjMKE3fhjHuZOxR5lZh2fB.vJL7QzI0eO9T/K1zC5b8e', 'GlobalTech Corp', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO "Company" ("id", "name", "industry", "size", "description", "website", "location", "culture", "benefits", "plan", "planExpiresAt", "trialUsed", "userId", "createdAt", "updatedAt") VALUES
('comp02', 'GlobalTech Corp', 'Tecnología', '201-500', 'Multinacional de tecnología con presencia en 12 países. Especialista en soluciones SaaS para empresas.', 'https://globaltech.com', 'Bogotá, Colombia', ARRAY['Diversidad', 'Inclusión', 'Impacto social', 'Innovación'], ARRAY['Seguro completo', 'Stock options', 'Educación', 'Vacaciones flexibles'], 'ENTERPRISE', CURRENT_TIMESTAMP + INTERVAL '30 days', true, 'usr_comp02', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ============================================================
-- 4. VACANTES DEMO
-- ============================================================

INSERT INTO "Vacancy" ("id", "companyId", "title", "description", "requirements", "salaryMin", "salaryMax", "salaryCurrency", "location", "type", "status", "category", "createdAt", "updatedAt") VALUES
('vac01', 'comp01', 'Desarrollador Full Stack Senior', 'Buscamos un desarrollador senior para liderar el desarrollo de nuestra plataforma SaaS.', ARRAY['5+ años experiencia', 'React y Node.js', 'AWS', 'PostgreSQL', 'Liderazgo de equipo'], 3500.00, 5500.00, 'USD', 'Ciudad de México, México', 'HYBRID', 'ACTIVE', 'technology', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('vac02', 'comp01', 'Gerente de Producto', 'Liderar la estrategia de producto de nuestra línea de soluciones enterprise.', ARRAY['8+ años en producto', 'Experiencia SaaS', 'Data-driven', 'Agile/Scrum'], 4500.00, 7000.00, 'USD', 'Ciudad de México, México', 'ONSITE', 'ACTIVE', 'product', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('vac03', 'comp01', 'Diseñador UX/UI Senior', 'Crear experiencias de usuario excepcionales para nuestra plataforma.', ARRAY['4+ años UX/UI', 'Figma', 'Design Systems', 'User Research'], 2800.00, 4500.00, 'USD', 'Ciudad de México, México', 'REMOTE', 'ACTIVE', 'design', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('vac04', 'comp02', 'Data Scientist', 'Desarrollar modelos de ML para optimización de procesos empresariales.', ARRAY['3+ años ML/AI', 'Python', 'TensorFlow', 'SQL', 'PhD preferido'], 4000.00, 6500.00, 'USD', 'Bogotá, Colombia', 'HYBRID', 'ACTIVE', 'technology', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('vac05', 'comp02', 'Director de Operaciones', 'Supervisar operaciones globales en 12 países.', ARRAY['10+ años en operaciones', 'Experiencia multinacional', 'Liderazgo ejecutivo', 'MBA preferido'], 8000.00, 12000.00, 'USD', 'Bogotá, Colombia', 'ONSITE', 'ACTIVE', 'operations', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('vac06', 'comp02', 'Especialista en Marketing Digital', 'Estrategia y ejecución de campañas de marketing digital B2B.', ARRAY['3+ años marketing digital', 'Google Ads', 'SEO/SEM', 'HubSpot', 'LinkedIn Ads'], 2000.00, 3500.00, 'USD', 'Bogotá, Colombia', 'REMOTE', 'ACTIVE', 'marketing', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ============================================================
-- 5. EVALUACIONES DEMO
-- ============================================================

-- Evaluación Cognitiva - Razonamiento Lógico
INSERT INTO "Assessment" ("id", "name", "category", "description", "timeLimitMinutes", "targetRoles", "isActive", "createdAt", "updatedAt") VALUES
('assess_cog_logic', 'Razonamiento Lógico', 'COGNITIVE', 'Evalúa la capacidad de razonamiento lógico y resolución de problemas abstractos.', 15, ARRAY['technology', 'operations', 'product'], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO "Question" ("id", "assessmentId", "type", "dimension", "subDimension", "text", "options", "order", "createdAt") VALUES
('q_cog_01', 'assess_cog_logic', 'MULTIPLE_CHOICE', 'logic', 'pattern_recognition', 'Si la serie es 2, 6, 12, 20, 30... ¿cuál es el siguiente número?', '[{"text": "36", "value": 0}, {"text": "40", "value": 0}, {"text": "42", "value": 1}, {"text": "48", "value": 0}]', 1, CURRENT_TIMESTAMP),
('q_cog_02', 'assess_cog_logic', 'MULTIPLE_CHOICE', 'logic', 'deduction', 'Si todos los A son B, y algunos B son C, ¿qué podemos concluir?', '[{"text": "Algunos A son C", "value": 0}, {"text": "Todos los C son A", "value": 0}, {"text": "No se puede determinar", "value": 1}, {"text": "Ninguna de las anteriores", "value": 0}]', 2, CURRENT_TIMESTAMP),
('q_cog_03', 'assess_cog_logic', 'SCENARIO', 'logic', 'problem_solving', 'Un equipo tiene 3 desarrolladores que completan 10 features por sprint. Si se agregan 2 desarrolladores más, y la productividad por persona baja un 15%, ¿cuántas features completarán?', '[{"text": "12.75 features", "value": 0}, {"text": "14.5 features", "value": 0}, {"text": "15 features", "value": 0}, {"text": "17 features", "value": 1}]', 3, CURRENT_TIMESTAMP);

-- Evaluación Psicométrica - Personalidad
INSERT INTO "Assessment" ("id", "name", "category", "description", "timeLimitMinutes", "targetRoles", "isActive", "createdAt", "updatedAt") VALUES
('assess_psych_personality', 'Personalidad OCEAN', 'PSYCHOMETRIC', 'Evaluación del modelo Big Five (OCEAN) de personalidad para entender el perfil comportamental del candidato.', 20, ARRAY['all'], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO "Question" ("id", "assessmentId", "type", "dimension", "subDimension", "text", "options", "order", "createdAt") VALUES
('q_psy_01', 'assess_psych_personality', 'LIKERT_SCALE', 'openness', 'curiosity', 'Disfruto explorar nuevas ideas y conceptos abstractos.', '[{"text": "Totalmente en desacuerdo", "value": 1}, {"text": "En desacuerdo", "value": 2}, {"text": "Neutral", "value": 3}, {"text": "De acuerdo", "value": 4}, {"text": "Totalmente de acuerdo", "value": 5}]', 1, CURRENT_TIMESTAMP),
('q_psy_02', 'assess_psych_personality', 'LIKERT_SCALE', 'conscientiousness', 'organization', 'Soy metódico/a y me gusta tener todo organizado.', '[{"text": "Totalmente en desacuerdo", "value": 1}, {"text": "En desacuerdo", "value": 2}, {"text": "Neutral", "value": 3}, {"text": "De acuerdo", "value": 4}, {"text": "Totalmente de acuerdo", "value": 5}]', 2, CURRENT_TIMESTAMP),
('q_psy_03', 'assess_psych_personality', 'LIKERT_SCALE', 'extraversion', 'sociability', 'Me gusta trabajar en equipo y colaborar estrechamente con otros.', '[{"text": "Totalmente en desacuerdo", "value": 1}, {"text": "En desacuerdo", "value": 2}, {"text": "Neutral", "value": 3}, {"text": "De acuerdo", "value": 4}, {"text": "Totalmente de acuerdo", "value": 5}]', 3, CURRENT_TIMESTAMP);

-- Evaluación Comportamental - SJT
INSERT INTO "Assessment" ("id", "name", "category", "description", "timeLimitMinutes", "targetRoles", "isActive", "createdAt", "updatedAt") VALUES
('assess_behav_sjt', 'Juicio Situacional (SJT)', 'BEHAVIORAL', 'Evalúa cómo el candidato reacciona ante situaciones laborales reales que involucran liderazgo, trabajo en equipo y resolución de conflictos.', 25, ARRAY['management', 'operations', 'sales', 'marketing'], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO "Question" ("id", "assessmentId", "type", "dimension", "subDimension", "text", "scenario", "options", "order", "createdAt") VALUES
('q_beh_01', 'assess_behav_sjt', 'SCENARIO', 'leadership', 'conflict_resolution', '¿Qué harías?', 'Tu equipo tiene un conflicto entre dos desarrolladores que no se ponen de acuerdo en la arquitectura de un proyecto crítico. La fecha límite es en 2 semanas.', '[{"text": "Impones tu decisión como líder", "value": 2}, {"text": "Organizas una sesión de brainstorming para encontrar solución conjunta", "value": 5}, {"text": "Dejas que resuelvan solos", "value": 1}, {"text": "Escalas al director de ingeniería", "value": 3}]', 1, CURRENT_TIMESTAMP),
('q_beh_02', 'assess_behav_sjt', 'SCENARIO', 'teamwork', 'collaboration', '¿Qué harías?', 'Un compañero de equipo está teniendo problemas personales y su rendimiento ha bajado. El proyecto depende de su entrega.', '[{"text": "Hablas con él/ella en privado para ofrecer apoyo", "value": 5}, {"text": "Reportas la situación a tu manager", "value": 3}, {"text": "Tomas sus tareas sin preguntar", "value": 2}, {"text": "Ignoras la situación y esperas que se resuelva", "value": 1}]', 2, CURRENT_TIMESTAMP),
('q_beh_03', 'assess_behav_sjt', 'SCENARIO', 'leadership', 'decision_making', '¿Qué harías?', 'Como gerente, recibes una queja de un cliente importante sobre un servicio defectuoso. El error fue de tu equipo.', '[{"text": "Asumes la responsabilidad y trabajas en la solución con el cliente", "value": 5}, {"text": "Investigas quién fue el responsable y lo reportas", "value": 2}, {"text": "Ofreces un descuento sin investigar", "value": 3}, {"text": "Dejas que el equipo lo resuelva", "value": 1}]', 3, CURRENT_TIMESTAMP);

-- Evaluación Técnica
INSERT INTO "Assessment" ("id", "name", "category", "description", "timeLimitMinutes", "targetRoles", "isActive", "createdAt", "updatedAt") VALUES
('assess_tech_dev', 'Evaluación Técnica - Desarrollo', 'TECHNICAL', 'Evalúa conocimientos técnicos en desarrollo de software: algoritmas, arquitectura, bases de datos y buenas prácticas.', 30, ARRAY['technology'], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO "Question" ("id", "assessmentId", "type", "dimension", "subDimension", "text", "options", "order", "createdAt") VALUES
('q_tech_01', 'assess_tech_dev', 'MULTIPLE_CHOICE', 'architecture', 'design_patterns', '¿Cuál es el patrón de diseño más adecuado para crear una única instancia de una clase que gestione recursos compartidos?', '[{"text": "Factory", "value": 0}, {"text": "Singleton", "value": 1}, {"text": "Observer", "value": 0}, {"text": "Strategy", "value": 0}]', 1, CURRENT_TIMESTAMP),
('q_tech_02', 'assess_tech_dev', 'MULTIPLE_CHOICE', 'databases', 'sql', '¿Cuál es la diferencia principal entre LEFT JOIN y INNER JOIN?', '[{"text": "LEFT JOIN retorna solo filas con match en ambas tablas", "value": 0}, {"text": "INNER JOIN retorna todas las filas de la tabla izquierda", "value": 0}, {"text": "LEFT JOIN retorna todas las filas de la tabla izquierda, con NULL donde no hay match", "value": 1}, {"text": "No hay diferencia significativa", "value": 0}]', 2, CURRENT_TIMESTAMP),
('q_tech_03', 'assess_tech_dev', 'MULTIPLE_CHOICE', 'algorithms', 'complexity', '¿Cuál es la complejidad temporal de Merge Sort?', '[{"text": "O(n)", "value": 0}, {"text": "O(n²)", "value": 0}, {"text": "O(n log n)", "value": 1}, {"text": "O(log n)", "value": 0}]', 3, CURRENT_TIMESTAMP);

-- ============================================================
-- 6. VACANCY-ASSESSMENT LINKS
-- ============================================================
INSERT INTO "VacancyAssessment" ("id", "vacancyId", "assessmentId", "weight") VALUES
('va01', 'vac01', 'assess_cog_logic', 1.5),
('va02', 'vac01', 'assess_tech_dev', 2.0),
('va03', 'vac01', 'assess_psych_personality', 1.0),
('va04', 'vac02', 'assess_behav_sjt', 2.0),
('va05', 'vac02', 'assess_psych_personality', 1.5),
('va06', 'vac03', 'assess_psych_personality', 1.0),
('va07', 'vac04', 'assess_cog_logic', 2.0),
('va08', 'vac04', 'assess_tech_dev', 1.5),
('va09', 'vac05', 'assess_behav_sjt', 2.5),
('va10', 'vac05', 'assess_psych_personality', 1.5),
('va11', 'vac06', 'assess_behav_sjt', 1.5),
('va12', 'vac06', 'assess_psych_personality', 1.0);

-- ============================================================
-- 7. MATCHES DEMO
-- ============================================================
INSERT INTO "MatchResult" ("id", "candidateId", "vacancyId", "companyId", "companyFitScore", "companyFitBreakdown", "candidateFitScore", "candidateFitBreakdown", "overallMatch", "recommendation", "createdAt", "updatedAt") VALUES
('match01', 'cand01', 'vac01', 'comp01', 92.5, '{"skillsMatch": 95, "assessmentMatch": 90, "experienceMatch": 88, "culturalFit": 95}', 88.0, '{"careerGrowth": 85, "salaryFit": 90, "cultureMatch": 88, "locationFit": 90}', 90.3, 'highly_recommended', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('match02', 'cand01', 'vac03', 'comp01', 85.0, '{"skillsMatch": 80, "assessmentMatch": 85, "experienceMatch": 90, "culturalFit": 85}', 82.0, '{"careerGrowth": 80, "salaryFit": 75, "cultureMatch": 90, "locationFit": 85}', 83.5, 'recommended', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('match03', 'cand02', 'vac05', 'comp02', 88.0, '{"skillsMatch": 85, "assessmentMatch": 90, "experienceMatch": 92, "culturalFit": 85}', 90.0, '{"careerGrowth": 95, "salaryFit": 80, "cultureMatch": 90, "locationFit": 95}', 89.0, 'highly_recommended', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('match04', 'cand02', 'vac04', 'comp02', 72.0, '{"skillsMatch": 70, "assessmentMatch": 75, "experienceMatch": 65, "culturalFit": 78}', 75.0, '{"careerGrowth": 80, "salaryFit": 70, "cultureMatch": 75, "locationFit": 75}', 73.5, 'recommended', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('match05', 'cand03', 'vac03', 'comp01', 95.0, '{"skillsMatch": 98, "assessmentMatch": 92, "experienceMatch": 90, "culturalFit": 95}', 91.0, '{"careerGrowth": 88, "salaryFit": 85, "cultureMatch": 95, "locationFit": 90}', 93.0, 'highly_recommended', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ============================================================
-- 8. DERIVACIONES DEMO
-- ============================================================
INSERT INTO "Referral" ("id", "candidateId", "vacancyId", "companyId", "status", "matchScore", "referredAt", "viewedAt", "contactedAt", "notes") VALUES
('ref01', 'cand01', 'vac01', 'comp01', 'CONTACTED', 90.3, CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP - INTERVAL '4 days', CURRENT_TIMESTAMP - INTERVAL '3 days', 'Candidata con excelente perfil técnico. En proceso de entrevista técnica.'),
('ref02', 'cand02', 'vac05', 'comp02', 'INTERVIEW', 89.0, CURRENT_TIMESTAMP - INTERVAL '7 days', CURRENT_TIMESTAMP - INTERVAL '6 days', CURRENT_TIMESTAMP - INTERVAL '5 days', 'Perfil sólido para Dirección de Operaciones. Agendada entrevista con CEO.'),
('ref03', 'cand03', 'vac03', 'comp01', 'VIEWED', 93.0, CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '1 days', NULL, 'Diseñadora excepcional. Portfolio impresionante.');

-- ============================================================
-- ✅ DATOS INICIALES CREADOS
-- 1 admin, 3 candidatos, 2 empresas
-- 3 planes de pago
-- 4 evaluaciones con 12 preguntas
-- 6 vacantes
-- 5 matches
-- 3 derivaciones
-- ============================================================
