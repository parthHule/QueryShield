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

-- 3. Simplified Department Structure
CREATE TABLE departments (
    department_id INT PRIMARY KEY AUTO_INCREMENT,
    department_name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    response_details TEXT,
    status ENUM('PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED') NOT NULL DEFAULT 'PENDING',
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    FOREIGN KEY (incident_id) REFERENCES incidents(incident_id),
    FOREIGN KEY (member_id) REFERENCES security_team(member_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
CREATE INDEX idx_affected_systems_type ON affected_systems(system_type_id);
CREATE INDEX idx_threat_guidelines_type ON threat_guidelines(threat_type_id);

-- Add indexes for better query performance
CREATE INDEX idx_incident_responses_incident_id ON incident_responses(incident_id);
CREATE INDEX idx_incident_responses_member_id ON incident_responses(member_id);
CREATE INDEX idx_incident_responses_status ON incident_responses(status);

-- INSERT STATEMENTS

-- 1. Insert Departments
INSERT INTO departments (department_name) VALUES
('IT'),
('Finance'),
('HR'),
('Sales'),
('Marketing'),
('Operations'),
('Legal'),
('Research & Development');

-- 2. Insert Threat Categories
INSERT INTO threat_categories (category_name, description) VALUES
('Cyber Attack', 'Direct cyber attacks on systems and networks'),
('Social Engineering', 'Human-focused manipulation attempts'),
('System Vulnerability', 'Technical system weaknesses'),
('Access Control', 'Authentication and authorization issues');

-- 3. Insert Threat Types
INSERT INTO threat_types (threat_name, category_id, description) VALUES
('Malware', 1, 'Malicious software including viruses and trojans'),
('Phishing', 2, 'Deceptive attempts to obtain sensitive information'),
('DDoS', 1, 'Distributed Denial of Service attacks'),
('Data Breach', 1, 'Unauthorized data access or exposure'),
('Unauthorized Access', 3, 'Unauthorized system or data access attempts'),
('Configuration Error', 3, 'Security misconfigurations in systems'),
('Social Engineering', 2, 'Psychological manipulation of people'),
('Ransomware', 1, 'Malicious encryption of data for ransom');

-- 4. Insert Threat Guidelines
INSERT INTO threat_guidelines (threat_type_id, guideline_category, guideline_description, risk_level) VALUES
-- Malware Guidelines
(1, 'DO', 'Keep all software and systems updated regularly', 'HIGH'),
(1, 'DO', 'Use reputable antivirus software and keep it active', 'CRITICAL'),
(1, 'DO', 'Perform regular system scans and monitoring', 'HIGH'),
(1, 'DONT', 'Download software from untrusted sources', 'CRITICAL'),
(1, 'DONT', 'Disable security software or firewalls', 'CRITICAL'),
(1, 'DONT', 'Open suspicious email attachments', 'HIGH'),

-- Phishing Guidelines
(2, 'DO', 'Verify email senders before clicking links', 'CRITICAL'),
(2, 'DO', 'Report suspicious emails to IT security team', 'HIGH'),
(2, 'DO', 'Enable two-factor authentication for accounts', 'CRITICAL'),
(2, 'DONT', 'Click on unknown email links or attachments', 'CRITICAL'),
(2, 'DONT', 'Provide personal information via email', 'CRITICAL'),
(2, 'DONT', 'Ignore security alerts related to account activity', 'HIGH'),

-- DDoS Guidelines
(3, 'DO', 'Implement DDoS mitigation solutions', 'CRITICAL'),
(3, 'DO', 'Monitor network traffic patterns regularly', 'HIGH'),
(3, 'DO', 'Maintain backup internet connections', 'HIGH'),
(3, 'DONT', 'Ignore unusual traffic spikes', 'HIGH'),
(3, 'DONT', 'Leave network monitoring tools disabled', 'CRITICAL'),
(3, 'DONT', 'Skip regular bandwidth capacity planning', 'MEDIUM'),

-- Data Breach Guidelines
(4, 'DO', 'Encrypt sensitive data at rest and in transit', 'CRITICAL'),
(4, 'DO', 'Implement strict access controls', 'CRITICAL'),
(4, 'DO', 'Maintain detailed access logs', 'HIGH'),
(4, 'DONT', 'Store unencrypted sensitive data', 'CRITICAL'),
(4, 'DONT', 'Share access credentials between users', 'CRITICAL'),
(4, 'DONT', 'Ignore suspicious data access patterns', 'HIGH'),

-- Unauthorized Access Guidelines
(5, 'DO', 'Implement strong password policies', 'CRITICAL'),
(5, 'DO', 'Use multi-factor authentication', 'CRITICAL'),
(5, 'DO', 'Regular access rights review', 'HIGH'),
(5, 'DONT', 'Share login credentials', 'CRITICAL'),
(5, 'DONT', 'Keep default passwords', 'CRITICAL'),
(5, 'DONT', 'Delay revoking access for departed users', 'HIGH'),

-- Configuration Error Guidelines
(6, 'DO', 'Follow security hardening guidelines', 'HIGH'),
(6, 'DO', 'Regular security configuration reviews', 'HIGH'),
(6, 'DO', 'Document all system configurations', 'MEDIUM'),
(6, 'DONT', 'Leave default settings unchanged', 'HIGH'),
(6, 'DONT', 'Skip security patches', 'CRITICAL'),
(6, 'DONT', 'Ignore security benchmarks', 'HIGH'),

-- Social Engineering Guidelines
(7, 'DO', 'Verify requests for sensitive information', 'CRITICAL'),
(7, 'DO', 'Regular security awareness training', 'HIGH'),
(7, 'DO', 'Report suspicious behavior immediately', 'HIGH'),
(7, 'DONT', 'Share sensitive information without verification', 'CRITICAL'),
(7, 'DONT', 'Skip security awareness programs', 'HIGH'),
(7, 'DONT', 'Trust unsolicited requests for information', 'CRITICAL'),

-- Ransomware Guidelines
(8, 'DO', 'Maintain offline backups', 'CRITICAL'),
(8, 'DO', 'Regular backup testing and verification', 'CRITICAL'),
(8, 'DO', 'Keep systems patched and updated', 'HIGH'),
(8, 'DONT', 'Pay ransom without consulting security team', 'CRITICAL'),
(8, 'DONT', 'Skip regular backup procedures', 'CRITICAL'),
(8, 'DONT', 'Open suspicious email attachments', 'HIGH');

-- 5. Insert Security Roles
INSERT INTO security_roles (role_name, description) VALUES
('Security Analyst', 'Monitors and analyzes security alerts'),
('Incident Responder', 'Handles active security incidents'),
('Security Engineer', 'Implements and maintains security systems'),
('Security Manager', 'Oversees security operations');

-- 6. Insert System Types
INSERT INTO system_types (type_name, description) VALUES
('Network Infrastructure', 'Core network components'),
('Database System', 'Data storage and management systems'),
('Web Application', 'Internet-facing applications'),
('Internal Application', 'Internal business applications'),
('Email System', 'Communication systems');

-- 7. Insert Severity Levels
INSERT INTO severity_levels (severity_name, description) VALUES
('Critical', 'Severe business impact requiring immediate attention'),
('High', 'Significant impact requiring urgent attention'),
('Medium', 'Moderate impact requiring planned response'),
('Low', 'Minor impact with minimal disruption');

-- 8. Insert Incident Statuses
INSERT INTO incident_statuses (status_name, description, is_active) VALUES
('Open', 'Initial incident report created', TRUE),
('Investigation', 'Active investigation ongoing', TRUE),
('Containment', 'Incident contained but not resolved', TRUE),
('Resolved', 'Incident has been resolved', FALSE),
('Closed', 'Investigation complete and documented', FALSE); 