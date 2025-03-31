"use server"

import mysql from "mysql2/promise"

export async function getTotalIncidents() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE
    })

    const [rows] = await connection.execute('SELECT COUNT(*) as total FROM incidents')
    await connection.end()
    
    return (rows as any)[0].total
  } catch (error) {
    console.error('Error fetching total incidents:', error)
    return 0
  }
}

export async function getCriticalIncidents() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE
    })

    const [rows] = await connection.execute(`
      SELECT COUNT(*) as total 
      FROM incidents i
      JOIN severity_levels sl ON i.severity_id = sl.severity_id
      WHERE sl.severity_name = 'Critical'
    `)
    await connection.end()
    
    return (rows as any)[0].total
  } catch (error) {
    console.error('Error fetching critical incidents:', error)
    return 0
  }
}

export async function getActiveIncidents() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE
    })

    // First, let's check the table structure
    const [columns] = await connection.execute(`
      DESCRIBE incidents
    `)
    console.log('Table structure:', columns)

    // Then, let's look at some sample incidents
    const [samples] = await connection.execute(`
      SELECT incident_id, incident_date, resolution_date 
      FROM incidents 
      LIMIT 5
    `)
    console.log('Sample incidents:', samples)

    // Now get our count
    const [rows] = await connection.execute(`
      SELECT COUNT(*) as total 
      FROM incidents 
      WHERE resolution_date IS NULL
    `)
    
    const total = (rows as any)[0].total
    console.log('Active incidents count:', total)
    
    await connection.end()
    return total
  } catch (error) {
    console.error('Error fetching active incidents:', error)
    return 0
  }
}

export async function getMostCommonIncidentType() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE
    })

    const [rows] = await connection.execute(`
      SELECT it.type_name, COUNT(*) as count
      FROM incidents i
      JOIN incident_types it ON i.type_id = it.type_id
      GROUP BY it.type_id, it.type_name
      ORDER BY count DESC
      LIMIT 1
    `)
    await connection.end()
    
    return {
      type: (rows as any)[0].type_name,
      count: (rows as any)[0].count
    }
  } catch (error) {
    console.error('Error fetching most common incident type:', error)
    return { type: 'Unknown', count: 0 }
  }
}

export async function getActiveDepartments() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE
    })

    const [rows] = await connection.execute(`
      SELECT COUNT(DISTINCT d.department_id) as total
      FROM incidents i
      JOIN departments d ON i.department_id = d.department_id
    `)
    await connection.end()
    
    return (rows as any)[0].total
  } catch (error) {
    console.error('Error fetching active departments:', error)
    return 0
  }
}

export async function getTotalDepartments() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE
    })

    const [rows] = await connection.execute(`
      SELECT COUNT(*) as total
      FROM departments
    `)
    await connection.end()
    
    return (rows as any)[0].total
  } catch (error) {
    console.error('Error fetching total departments:', error)
    return 0
  }
}

export async function getMonthlyIncidents() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE
    })

    // First, let's check what data we have
    const [checkData] = await connection.execute(`
      SELECT MIN(incident_date) as earliest, MAX(incident_date) as latest
      FROM incidents
    `)
    console.log('Date range:', checkData)

    // Modified query to get all months, even with zero incidents
    const [rows] = await connection.execute(`
      SELECT 
        m.month,
        COALESCE(COUNT(i.incident_id), 0) as incidents
      FROM (
        SELECT 1 as month_num, 'Jan' as month UNION SELECT 2, 'Feb' UNION
        SELECT 3, 'Mar' UNION SELECT 4, 'Apr' UNION SELECT 5, 'May' UNION
        SELECT 6, 'Jun' UNION SELECT 7, 'Jul' UNION SELECT 8, 'Aug' UNION
        SELECT 9, 'Sep' UNION SELECT 10, 'Oct' UNION SELECT 11, 'Nov' UNION
        SELECT 12, 'Dec'
      ) m
      LEFT JOIN incidents i ON MONTH(i.incident_date) = m.month_num
        AND YEAR(i.incident_date) = YEAR(CURRENT_DATE)
      GROUP BY m.month_num, m.month
      ORDER BY m.month_num
      LIMIT 6
    `)
    
    console.log('Monthly data:', rows)
    await connection.end()
    
    return rows as { month: string; incidents: number }[]
  } catch (error) {
    console.error('Error fetching monthly incidents:', error)
    return []
  }
}

export async function getRecentIncidents() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE
    })

    const [fullData] = await connection.execute(`
      SELECT 
        i.incident_id,
        i.description as incident_name,
        i.created_at as incident_date,
        COALESCE(it.type_name, 'Unknown Type') as type_name,
        COALESCE(sl.severity_name, 'Unknown Severity') as severity_name
      FROM incidents i
      LEFT JOIN incident_types it ON i.type_id = it.type_id
      LEFT JOIN severity_levels sl ON i.severity_id = sl.severity_id
      ORDER BY i.created_at DESC
      LIMIT 3
    `)

    console.log('Full incident data:', fullData)
    await connection.end()
    
    return fullData as {
      incident_id: number;
      incident_name: string;
      type_name: string;
      severity_name: string;
      incident_date: string;
    }[]
  } catch (error) {
    console.error('Detailed error:', error)
    return []
  }
}

export async function getSeverityDistribution() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE
    })

    const [rows] = await connection.execute(`
      SELECT 
        sl.severity_name as name,
        COUNT(*) as value,
        CASE 
          WHEN sl.severity_name = 'Critical' THEN '#ef4444'
          WHEN sl.severity_name = 'High' THEN '#f97316'
          WHEN sl.severity_name = 'Medium' THEN '#eab308'
          ELSE '#22c55e'
        END as color
      FROM incidents i
      JOIN severity_levels sl ON i.severity_id = sl.severity_id
      GROUP BY sl.severity_id, sl.severity_name
      ORDER BY sl.severity_id
    `)
    await connection.end()
    
    return rows as { name: string; value: number; color: string }[]
  } catch (error) {
    console.error('Error fetching severity distribution:', error)
    return []
  }
}

export async function getIncidentTypeDistribution() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE
    })

    const [rows] = await connection.execute(`
      SELECT 
        it.type_name as name,
        COUNT(*) as value
      FROM incidents i
      JOIN incident_types it ON i.type_id = it.type_id
      GROUP BY it.type_id, it.type_name
      ORDER BY value DESC
      LIMIT 5
    `)
    await connection.end()
    
    return rows as { name: string; value: number }[]
  } catch (error) {
    console.error('Error fetching incident type distribution:', error)
    return []
  }
}

export async function updatePassword(email: string, currentPassword: string, newPassword: string) {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE
    })

    // First verify the current password with email
    const [reporter] = await connection.execute(`
      SELECT * FROM reporters 
      WHERE email = ? AND password = ?
    `, [email, currentPassword])

    if (!(reporter as any[])[0]) {
      await connection.end()
      return { success: false, message: "Current password is incorrect" }
    }

    // Update the password for the correct email
    await connection.execute(`
      UPDATE reporters 
      SET password = ?
      WHERE email = ?
    `, [newPassword, email])

    await connection.end()
    return { success: true, message: "Password updated successfully" }
  } catch (error) {
    console.error('Error updating password:', error)
    return { success: false, message: "Failed to update password" }
  }
}

export async function updatePhoneNumber(email: string, newPhoneNumber: string) {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE
    })

    // Update contact number for the logged-in reporter
    await connection.execute(`
      UPDATE reporters 
      SET contact_number = ?
      WHERE email = ?
    `, [newPhoneNumber, email])

    await connection.end()
    return { success: true, message: "Phone number updated successfully" }
  } catch (error) {
    console.error('Error updating phone number:', error)
    return { success: false, message: "Failed to update phone number" }
  }
} 