-- Dados iniciais para o sistema
-- Igreja Esperança - Ministério Compartilhar Esperança

-- Inserir usuário administrador padrão
INSERT INTO users (id, email, name, role, status) VALUES 
('admin-user-id', 'admin@igrejaesp.org', 'Administrador do Sistema', 'ADMIN', 'ACTIVE');

-- Inserir assistente social padrão
INSERT INTO users (id, email, name, role, status) VALUES 
('assistant-user-id', 'assistente@igrejaesp.org', 'Assistente Social', 'ASSISTANT_SOCIAL', 'ACTIVE');

-- Configurações iniciais do sistema
INSERT INTO system_config (key, value, description) VALUES 
('church_name', 'Igreja Esperança', 'Nome da igreja'),
('ministry_name', 'Ministério Compartilhar Esperança', 'Nome do ministério'),
('system_version', '1.0.0', 'Versão atual do sistema'),
('max_families_per_assistant', '50', 'Máximo de famílias por assistente social'),
('auto_assign_families', 'false', 'Atribuição automática de famílias'),
('notification_email_enabled', 'true', 'Envio de notificações por email habilitado'),
('backup_frequency_days', '7', 'Frequência de backup em dias'),
('family_code_prefix', 'fam', 'Prefixo para códigos de família'),
('visit_reminder_hours', '24', 'Horas antes da visita para lembrete'),
('urgent_task_notification', 'true', 'Notificação para tarefas urgentes');

-- Inserir alguns serviços comunitários padrão (para usar nos JSONs)
-- Estes serão usados como opções nos formulários
INSERT INTO system_config (key, value, description) VALUES 
('available_services', '["CRAS", "CREAS", "UBS", "Escola", "Creche", "CAPS", "Conselho Tutelar"]', 'Serviços comunitários disponíveis'),
('available_programs', '["Bolsa Família", "Auxílio Brasil", "BPC", "Cartão Alimentação", "Vale Gás", "Tarifa Social"]', 'Programas sociais disponíveis'),
('common_diseases', '["Diabetes", "Hipertensão", "Depressão", "Ansiedade", "Artrite", "Asma", "Cardiopatia"]', 'Doenças mais comuns'),
('vulnerability_types', '["Violência Doméstica", "Uso de Drogas", "Alcoolismo", "Desemprego", "Deficiência", "Idoso Dependente", "Criança em Risco"]', 'Tipos de vulnerabilidades'),
('family_potentials', '["Liderança", "Artesanato", "Culinária", "Costura", "Jardinagem", "Música", "Esporte", "Estudos"]', 'Potencialidades familiares comuns');
