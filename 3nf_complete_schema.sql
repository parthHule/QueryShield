-- Create database
CREATE DATABASE IF NOT EXISTS cybersecurity_incidents_3nf;
USE cybersecurity_incidents_3nf;

-- 1. Base Reference Tables (Lookup Tables)
-- Severity Levels
CREATE TABLE severity_levels (
    severity_id INT PRIMARY KEY AUTO_INCREMENT,
    severity_name VARCHAR(20) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Incident Types
CREATE TABLE incident_types (
    type_id INT PRIMARY KEY AUTO_INCREMENT,
    type_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- System Types
CREATE TABLE system_types (
    system_type_id INT PRIMARY KEY AUTO_INCREMENT,
    type_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criticality Levels
CREATE TABLE criticality_levels (
    criticality_id INT PRIMARY KEY AUTO_INCREMENT,
    level_name ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Security Team Structure
-- Security Roles
CREATE TABLE security_roles (
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Security Expertise
CREATE TABLE security_expertise (
    expertise_id INT PRIMARY KEY AUTO_INCREMENT,
    expertise_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Security Team Members
CREATE TABLE security_team (
    member_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES security_roles(role_id)
);

-- Security Team Expertise (Many-to-Many)
CREATE TABLE security_team_expertise (
    member_id INT,
    expertise_id INT,
    PRIMARY KEY (member_id, expertise_id),
    FOREIGN KEY (member_id) REFERENCES security_team(member_id),
    FOREIGN KEY (expertise_id) REFERENCES security_expertise(expertise_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Department Structure
-- Department Heads
CREATE TABLE department_heads (
    head_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Departments
CREATE TABLE departments (
    department_id INT PRIMARY KEY AUTO_INCREMENT,
    department_name VARCHAR(100) NOT NULL UNIQUE,
    head_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (head_id) REFERENCES department_heads(head_id)
);

-- 4. Systems and Infrastructure
-- Affected Systems
CREATE TABLE affected_systems (
    system_id INT PRIMARY KEY AUTO_INCREMENT,
    system_name VARCHAR(100) NOT NULL UNIQUE,
    system_type_id INT,
    criticality_id INT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (system_type_id) REFERENCES system_types(system_type_id),
    FOREIGN KEY (criticality_id) REFERENCES criticality_levels(criticality_id)
);

-- 5. Incident Management
-- Incident Statuses
CREATE TABLE incident_statuses (
    status_id INT PRIMARY KEY AUTO_INCREMENT,
    status_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reporters
CREATE TABLE reporters (
    reporter_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    department_id INT,
    contact_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

-- Main Incidents Table
CREATE TABLE incidents (
    incident_id INT PRIMARY KEY AUTO_INCREMENT,
    incident_title VARCHAR(200) NOT NULL,
    type_id INT NOT NULL,
    severity_id INT NOT NULL,
    system_id INT NOT NULL,
    reporter_id INT NOT NULL,
    status_id INT NOT NULL,
    discovered_at TIMESTAMP NOT NULL,
    reported_at TIMESTAMP NOT NULL,
    financial_impact DECIMAL(15,2),
    root_cause TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (type_id) REFERENCES incident_types(type_id),
    FOREIGN KEY (severity_id) REFERENCES severity_levels(severity_id),
    FOREIGN KEY (system_id) REFERENCES affected_systems(system_id),
    FOREIGN KEY (reporter_id) REFERENCES reporters(reporter_id),
    FOREIGN KEY (status_id) REFERENCES incident_statuses(status_id)
);

-- Incident Responses
CREATE TABLE incident_responses (
    response_id INT PRIMARY KEY AUTO_INCREMENT,
    incident_id INT NOT NULL,
    member_id INT NOT NULL,
    action_taken TEXT NOT NULL,
    response_time INT,
    started_at TIMESTAMP NOT NULL,
    completed_at TIMESTAMP,
    status ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (incident_id) REFERENCES incidents(incident_id),
    FOREIGN KEY (member_id) REFERENCES security_team(member_id)
);

-- Incident Logs
CREATE TABLE incident_logs (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    incident_id INT NOT NULL,
    member_id INT,
    log_message TEXT NOT NULL,
    log_type ENUM('INFO', 'WARNING', 'ERROR', 'CRITICAL') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (incident_id) REFERENCES incidents(incident_id),
    FOREIGN KEY (member_id) REFERENCES security_team(member_id)
);

-- 6. Threat Management
-- Threat Categories
CREATE TABLE threat_categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Threat Types
CREATE TABLE threat_types (
    type_id INT PRIMARY KEY AUTO_INCREMENT,
    threat_name VARCHAR(100) NOT NULL UNIQUE,
    category_id INT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES threat_categories(category_id)
);

-- Threat Guidelines
CREATE TABLE threat_guidelines (
    guideline_id INT PRIMARY KEY AUTO_INCREMENT,
    threat_type_id INT NOT NULL,
    guideline_category ENUM('DO', 'DONT') NOT NULL,
    guideline_description TEXT NOT NULL,
    risk_level ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (threat_type_id) REFERENCES threat_types(type_id)
);

-- 7. Reports
-- Incident Reports
CREATE TABLE incident_reports (
    report_id INT PRIMARY KEY AUTO_INCREMENT,
    incident_id INT NOT NULL,
    summary TEXT NOT NULL,
    detailed_analysis TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (incident_id) REFERENCES incidents(incident_id)
);

-- 8. Performance Indexes
CREATE INDEX idx_incidents_discovered_at ON incidents(discovered_at);
CREATE INDEX idx_incidents_type_severity ON incidents(type_id, severity_id);
CREATE INDEX idx_incident_responses_time ON incident_responses(started_at, completed_at);
CREATE INDEX idx_security_team_role ON security_team(role_id);
CREATE INDEX idx_departments_head ON departments(head_id);
CREATE INDEX idx_affected_systems_type ON affected_systems(system_type_id);
CREATE INDEX idx_threat_guidelines_type ON threat_guidelines(threat_type_id); 