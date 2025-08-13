-- Sistema de Gestão de Assistência Familiar
-- Igreja Esperança - Ministério Compartilhar Esperança
-- Script de criação das tabelas principais

-- ===== ENUMS =====

-- Enums para usuários
CREATE TYPE user_role AS ENUM ('ADMIN', 'ASSISTANT_SOCIAL');
CREATE TYPE user_status AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- Enums para formulário de família
CREATE TYPE marital_status AS ENUM (
  'SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED', 'SEPARATED', 'STABLE_UNION'
);

CREATE TYPE education AS ENUM (
  'ILLITERATE', 'INCOMPLETE_PRIMARY', 'COMPLETE_PRIMARY', 
  'INCOMPLETE_SECONDARY', 'COMPLETE_SECONDARY', 
  'INCOMPLETE_HIGHER', 'COMPLETE_HIGHER', 'POSTGRADUATE'
);

CREATE TYPE race AS ENUM ('WHITE', 'BLACK', 'BROWN', 'YELLOW', 'INDIGENOUS');
CREATE TYPE gender AS ENUM ('MALE', 'FEMALE');

CREATE TYPE housing_type AS ENUM (
  'OWNED', 'LEASED', 'RENTED', 'FINANCED', 'CEDED', 'OCCUPATION', 'STREET', 'OTHER'
);

CREATE TYPE construction_type AS ENUM (
  'BRICK_MASONRY', 'ADOBE_COVERED', 'ADOBE_UNCOVERED', 
  'WOOD', 'RECYCLED_MATERIAL', 'PLYWOOD'
);

CREATE TYPE electricity_type AS ENUM (
  'OWN_METER', 'NO_METER', 'LOW_INCOME', 'COMMUNITY_METER'
);

CREATE TYPE sewage_destination AS ENUM (
  'PUBLIC_NETWORK', 'OPEN_SKY', 'SEPTIC_TANK', 'OTHER'
);

CREATE TYPE bathroom_type AS ENUM ('ABSENT', 'OWN', 'COLLECTIVE');

CREATE TYPE water_supply AS ENUM (
  'PUBLIC_PIPED', 'TRUCK_WELL_NATURAL', 'COLLECTIVE_TAPS', 'OTHER'
);

CREATE TYPE waste_destination AS ENUM (
  'HOME_COLLECTION', 'DUMPSTER', 'PUBLIC_AREA', 'BURIED', 'BURNED', 'OTHER'
);

CREATE TYPE relationship_quality AS ENUM (
  'GOOD', 'AGGRESSIVE', 'INDIFFERENT', 'UNDERSTANDING'
);

CREATE TYPE family_relationship_status AS ENUM (
  'SATISFACTORY', 'UNSATISFACTORY', 'IRREGULAR'
);

CREATE TYPE communication AS ENUM ('OPEN', 'THREATENING', 'DOUBLE_MEANING');
CREATE TYPE rules AS ENUM ('ESTABLISHED', 'NOT_ESTABLISHED');
CREATE TYPE roles AS ENUM ('DEFINED', 'INVERTED', 'CONFUSED', 'OTHER');
CREATE TYPE family_bonds AS ENUM ('PRESERVED', 'LASTING', 'FRAGILE', 'HARMONIOUS', 'ABSENT');
CREATE TYPE food_situation AS ENUM ('BALANCED', 'PRECARIOUS');

-- Enums para sistema
CREATE TYPE family_status AS ENUM (
  'PENDING', 'IN_ANALYSIS', 'ACTIVE', 'ASSISTED', 'INACTIVE', 'ARCHIVED'
);

CREATE TYPE urgency_level AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
CREATE TYPE visit_status AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED');
CREATE TYPE visit_type AS ENUM ('HOME_VISIT', 'OFFICE_VISIT', 'PHONE_CALL', 'OTHER');
CREATE TYPE task_status AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
CREATE TYPE task_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

CREATE TYPE notification_type AS ENUM (
  'NEW_FAMILY', 'FAMILY_ASSIGNED', 'NEW_TASK', 'VISIT_REMINDER', 
  'EMERGENCY_ALERT', 'SYSTEM_UPDATE'
);

CREATE TYPE notification_status AS ENUM ('UNREAD', 'READ', 'ARCHIVED');
CREATE TYPE document_type AS ENUM ('PDF_REPORT', 'PHOTO', 'DOCUMENT_SCAN', 'OTHER');

CREATE TYPE action_type AS ENUM (
  'CREATE', 'UPDATE', 'DELETE', 'VIEW', 'LOGIN', 'LOGOUT', 'ASSIGN', 'UNASSIGN'
);

-- ===== TABELAS PRINCIPAIS =====

-- Tabela de usuários
CREATE TABLE users (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role user_role DEFAULT 'ASSISTANT_SOCIAL',
  status user_status DEFAULT 'ACTIVE',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela principal de famílias
CREATE TABLE families (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  public_code TEXT UNIQUE NOT NULL, -- fam-YYYYMMDD-XXXXXX
  status family_status DEFAULT 'PENDING',
  urgency_level urgency_level DEFAULT 'LOW',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Informações pessoais do responsável
  responsible_name TEXT NOT NULL,
  number_of_members INTEGER,
  marital_status marital_status,
  nis TEXT,
  cpf TEXT,
  rg TEXT,
  sus_card TEXT,
  birth_date DATE,
  age INTEGER,
  gender gender,
  education education,
  race race,
  formal_income DECIMAL(10,2),
  informal_income DECIMAL(10,2),
  occupation TEXT,
  professional_course TEXT,
  church_in_homes TEXT,
  ic_leader TEXT,
  leader_contact TEXT,
  
  -- Endereço e contato
  street TEXT NOT NULL,
  number TEXT,
  neighborhood TEXT NOT NULL,
  zip_code TEXT,
  city TEXT NOT NULL,
  reference_point TEXT,
  phone TEXT,
  contact_person TEXT,
  visit_day TEXT,
  visit_time TEXT,
  
  -- Moradia
  housing_type housing_type,
  paved_street BOOLEAN DEFAULT FALSE,
  number_of_rooms INTEGER,
  number_of_bedrooms INTEGER,
  number_of_bathrooms INTEGER,
  construction_type construction_type,
  risk_location BOOLEAN DEFAULT FALSE,
  electricity_type electricity_type,
  sewage_destination sewage_destination,
  bathroom_type bathroom_type,
  water_supply water_supply,
  waste_destination waste_destination,
  
  -- Saúde e alimentação
  vaccines_up_to_date BOOLEAN DEFAULT FALSE,
  food_situation food_situation,
  
  -- Serviços comunitários (JSON arrays)
  participates_in_services JSONB,
  participates_in_programs JSONB,
  
  -- Despesas mensais
  rent_expense DECIMAL(10,2),
  housing_installment DECIMAL(10,2),
  food_expense DECIMAL(10,2),
  water_expense DECIMAL(10,2),
  electricity_expense DECIMAL(10,2),
  transport_expense DECIMAL(10,2),
  medication_expense DECIMAL(10,2),
  gas_expense DECIMAL(10,2),
  phone_expense DECIMAL(10,2),
  internet_expense DECIMAL(10,2),
  other_expenses DECIMAL(10,2),
  total_expenses DECIMAL(10,2),
  total_family_income DECIMAL(10,2),
  income_expense_result DECIMAL(10,2),
  
  -- Ambiente familiar
  pregnant_in_family BOOLEAN DEFAULT FALSE,
  pregnancy_months INTEGER,
  prenatal_care BOOLEAN DEFAULT FALSE,
  elderly_in_family BOOLEAN DEFAULT FALSE,
  elderly_age INTEGER,
  conjugal_relationship relationship_quality,
  parents_children_relation relationship_quality,
  children_parents_relation relationship_quality,
  siblings_relationship relationship_quality,
  family_relationship family_relationship_status,
  meals_with_family BOOLEAN DEFAULT FALSE,
  communication communication,
  rules rules,
  roles roles,
  roles_other TEXT,
  family_bonds family_bonds,
  leadership TEXT,
  conflict TEXT,
  self_esteem TEXT,
  family_social_life TEXT,
  
  -- Doenças e vulnerabilidades (JSON arrays)
  diseases JSONB,
  vulnerabilities JSONB,
  
  -- Potencialidades (JSON array)
  family_potentials JSONB,
  
  -- Interesses para qualificação
  professional_interests TEXT,
  
  -- Necessidades imediatas
  immediate_needs TEXT,
  
  -- Observações finais
  final_observations TEXT,
  
  -- Relacionamentos
  assigned_to TEXT REFERENCES users(id)
);

-- Tabela de integrantes da família
CREATE TABLE family_members (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  kinship TEXT NOT NULL, -- Parentesco
  birth_date DATE,
  occupation TEXT,
  professional_course TEXT,
  education education,
  formal_income DECIMAL(10,2),
  informal_income DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Relacionamentos
  family_id TEXT NOT NULL REFERENCES families(id) ON DELETE CASCADE
);

-- Tabela de visitas
CREATE TABLE visits (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  description TEXT,
  visit_type visit_type DEFAULT 'HOME_VISIT',
  status visit_status DEFAULT 'SCHEDULED',
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Relacionamentos
  family_id TEXT NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  assigned_to TEXT NOT NULL REFERENCES users(id)
);

-- Tabela de tarefas
CREATE TABLE tasks (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  description TEXT,
  status task_status DEFAULT 'PENDING',
  priority task_priority DEFAULT 'MEDIUM',
  due_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Relacionamentos
  family_id TEXT REFERENCES families(id) ON DELETE CASCADE,
  assigned_to TEXT NOT NULL REFERENCES users(id)
);

-- Tabela de histórico de atendimentos
CREATE TABLE attendance_history (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  description TEXT NOT NULL,
  urgency urgency_level DEFAULT 'LOW',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Relacionamentos
  family_id TEXT NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  attended_by TEXT NOT NULL REFERENCES users(id)
);

-- Tabela de notificações
CREATE TABLE notifications (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type notification_type NOT NULL,
  status notification_status DEFAULT 'UNREAD',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE,
  
  -- Relacionamentos
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  family_id TEXT REFERENCES families(id) ON DELETE CASCADE
);

-- Tabela de documentos
CREATE TABLE documents (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size INTEGER NOT NULL,
  type document_type NOT NULL,
  description TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Relacionamentos
  family_id TEXT NOT NULL REFERENCES families(id) ON DELETE CASCADE
);

-- Tabela de auditoria
CREATE TABLE audit_logs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  action action_type NOT NULL,
  table_name TEXT NOT NULL,
  record_id TEXT,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Relacionamentos
  user_id TEXT NOT NULL REFERENCES users(id)
);

-- Tabela de configurações do sistema
CREATE TABLE system_config (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== ÍNDICES PARA PERFORMANCE =====

-- Índices para busca e performance
CREATE INDEX idx_families_public_code ON families(public_code);
CREATE INDEX idx_families_status ON families(status);
CREATE INDEX idx_families_assigned_to ON families(assigned_to);
CREATE INDEX idx_families_created_at ON families(created_at);
CREATE INDEX idx_families_urgency_level ON families(urgency_level);

CREATE INDEX idx_family_members_family_id ON family_members(family_id);
CREATE INDEX idx_visits_family_id ON visits(family_id);
CREATE INDEX idx_visits_assigned_to ON visits(assigned_to);
CREATE INDEX idx_visits_scheduled_at ON visits(scheduled_at);
CREATE INDEX idx_visits_status ON visits(status);

CREATE INDEX idx_tasks_family_id ON tasks(family_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_table_name ON audit_logs(table_name);

-- ===== TRIGGERS PARA UPDATED_AT =====

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_families_updated_at BEFORE UPDATE ON families
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_family_members_updated_at BEFORE UPDATE ON family_members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_visits_updated_at BEFORE UPDATE ON visits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attendance_history_updated_at BEFORE UPDATE ON attendance_history
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_config_updated_at BEFORE UPDATE ON system_config
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
