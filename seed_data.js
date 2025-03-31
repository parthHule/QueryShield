const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'root',
  database: process.env.MYSQL_DATABASE || 'cybersecurity_incidents_3nf'
};

// First, define system types (needed for affected_systems)
const systemTypes = {
  system_types: [
    { type_name: 'Server', description: 'Server systems' },
    { type_name: 'Database', description: 'Database systems' },
    { type_name: 'Application', description: 'Web and internal applications' }
  ]
};

// Then define the rest of the seed data
const seedData = {
  // 1. First Level (No Foreign Keys)
  incident_statuses: [
    { status_name: 'Open', description: 'Incident is active and being investigated' },
    { status_name: 'In Progress', description: 'Investigation and response ongoing' },
    { status_name: 'Resolved', description: 'Incident has been resolved' },
    { status_name: 'Closed', description: 'Investigation completed and documented' }
  ],

  criticality_levels: [
    { level_name: 'LOW', description: 'Minimal impact on operations' },
    { level_name: 'MEDIUM', description: 'Moderate impact on business functions' },
    { level_name: 'HIGH', description: 'Significant impact on critical services' },
    { level_name: 'CRITICAL', description: 'Severe impact on core business operations' }
  ],

  incident_types: [
    { type_name: 'Ransomware', description: 'Malicious software that encrypts data for ransom' },
    { type_name: 'Phishing', description: 'Social engineering attacks via email or messaging' },
    { type_name: 'DDoS', description: 'Distributed Denial of Service attacks' },
    { type_name: 'Data Breach', description: 'Unauthorized access to sensitive data' },
    { type_name: 'Malware', description: 'Malicious software infection' }
  ],

  departments: [
    { department_name: 'IT' },
    { department_name: 'Finance' },
    { department_name: 'HR' }
  ],

  // 2. Second Level (Depends on First Level)
  affected_systems: [
    { system_name: 'Email Server', system_type_id: 1, criticality_id: 1 },
    { system_name: 'Customer Database', system_type_id: 2, criticality_id: 1 },
    { system_name: 'File Server', system_type_id: 1, criticality_id: 2 },
    { system_name: 'Web Application', system_type_id: 3, criticality_id: 1 },
    { system_name: 'Employee Portal', system_type_id: 3, criticality_id: 2 }
  ],

  security_team: [
    { first_name: 'John', last_name: 'Smith', email: 'john.smith@security.com', role_id: 1 },
    { first_name: 'Sarah', last_name: 'Johnson', email: 'sarah.j@security.com', role_id: 2 },
    { first_name: 'Michael', last_name: 'Chen', email: 'michael.c@security.com', role_id: 3 }
  ],

  reporters: [
    { first_name: 'Alice', last_name: 'Brown', email: 'alice.b@company.com', department_id: 1 },
    { first_name: 'Bob', last_name: 'Wilson', email: 'bob.w@company.com', department_id: 2 },
    { first_name: 'Carol', last_name: 'Davis', email: 'carol.d@company.com', department_id: 3 }
  ],

  // 3. Third Level (Depends on Second Level)
  incidents: [
    {
      incident_title: 'Ransomware Attack on File Server',
      type_id: 1,
      severity_id: 1,
      system_id: 3,
      reporter_id: 1,
      status_id: 1,
      discovered_at: '2024-03-15 10:30:00',
      reported_at: '2024-03-15 10:35:00',
      description: 'File server encrypted by ransomware, ransom note found',
      financial_impact: 50000.00
    },
    {
      incident_title: 'Phishing Campaign Detected',
      type_id: 2,
      severity_id: 2,
      system_id: 1,
      reporter_id: 2,
      status_id: 1,
      discovered_at: '2024-03-14 15:45:00',
      reported_at: '2024-03-14 16:00:00',
      description: 'Multiple employees reported suspicious emails',
      financial_impact: 5000.00
    }
  ],

  // 4. Fourth Level (Depends on Third Level)
  incident_logs: [
    {
      incident_id: 1,
      logged_by: 1,
      log_time: '2024-03-15 10:35:00',
      activity: 'Initial incident reported',
      details: 'User reported inability to access files'
    }
  ],

  incident_responses: [
    {
      incident_id: 1,
      responder_id: 1,
      response_time: '2024-03-15 10:45:00',
      action_taken: 'System isolation',
      outcome: 'Affected system isolated from network'
    }
  ],

  incident_reports: [
    {
      incident_id: 1,
      reporter_id: 1,
      report_time: '2024-03-15 11:00:00',
      report_type: 'Initial',
      details: 'Comprehensive initial assessment of ransomware incident',
      recommendations: 'Implement system backup restoration'
    }
  ]
};

async function seedDatabase() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('Connected to database');

    // Define the order of table insertions
    const insertionOrder = [
      'system_types',
      'criticality_levels',
      'incident_types',
      'incident_statuses',
      'departments',
      'affected_systems',
      'security_team',
      'reporters'
    ];

    // Store IDs for reference
    const systemIds = {};
    const reporterIds = {};

    // Insert data in the correct order
    for (const tableName of insertionOrder) {
      const data = seedData[tableName];
      if (data) {
        console.log(`Seeding ${tableName}...`);
        for (const item of data) {
          try {
            const [result] = await connection.query(`INSERT INTO ${tableName} SET ?`, item);
            
            // Store system_id for reference
            if (tableName === 'affected_systems') {
              const [rows] = await connection.query(
                'SELECT system_id FROM affected_systems WHERE system_name = ?',
                [item.system_name]
              );
              if (rows[0]) {
                systemIds[item.system_name] = rows[0].system_id;
              }
            }

            // Store reporter_id for reference
            if (tableName === 'reporters') {
              const [rows] = await connection.query(
                'SELECT reporter_id FROM reporters WHERE email = ?',
                [item.email]
              );
              if (rows[0]) {
                reporterIds[item.email] = rows[0].reporter_id;
              }
            }

            console.log(`  Added entry to ${tableName}`);
          } catch (err) {
            if (err.code === 'ER_DUP_ENTRY') {
              // For duplicate entries, get their IDs
              if (tableName === 'affected_systems') {
                const [rows] = await connection.query(
                  'SELECT system_id FROM affected_systems WHERE system_name = ?',
                  [item.system_name]
                );
                if (rows[0]) {
                  systemIds[item.system_name] = rows[0].system_id;
                }
              }
              if (tableName === 'reporters') {
                const [rows] = await connection.query(
                  'SELECT reporter_id FROM reporters WHERE email = ?',
                  [item.email]
                );
                if (rows[0]) {
                  reporterIds[item.email] = rows[0].reporter_id;
                }
              }
              console.log(`  Skipping duplicate entry in ${tableName}`);
              continue;
            }
            console.error(`Error inserting into ${tableName}:`, err.message);
            throw err;
          }
        }
        console.log(`✓ ${tableName} seeded`);
      }
    }

    // Now insert incidents with correct IDs
    console.log('Seeding incidents...');
    const incidentsWithCorrectIds = [
      {
        incident_title: 'Ransomware Attack on File Server',
        type_id: 1,
        severity_id: 1,
        system_id: systemIds['File Server'],
        reporter_id: reporterIds['alice.b@company.com'],
        status_id: 1,
        discovered_at: '2024-03-15 10:30:00',
        reported_at: '2024-03-15 10:35:00',
        description: 'File server encrypted by ransomware, ransom note found',
        financial_impact: 50000.00
      },
      {
        incident_title: 'Phishing Campaign Detected',
        type_id: 2,
        severity_id: 2,
        system_id: systemIds['Email Server'],
        reporter_id: reporterIds['bob.w@company.com'],
        status_id: 1,
        discovered_at: '2024-03-14 15:45:00',
        reported_at: '2024-03-14 16:00:00',
        description: 'Multiple employees reported suspicious emails',
        financial_impact: 5000.00
      }
    ];

    for (const incident of incidentsWithCorrectIds) {
      try {
        await connection.query('INSERT INTO incidents SET ?', incident);
        console.log('  Added incident');
      } catch (err) {
        console.error('Error inserting incident:', err.message);
        throw err;
      }
    }
    console.log('✓ Incidents seeded');

    // ... rest of the seeding (logs, responses, reports)

    await connection.end();
    console.log('Database seeding completed');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase(); 