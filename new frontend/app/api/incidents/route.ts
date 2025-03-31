import { NextResponse } from 'next/server';
import pool from '../db';

export async function GET() {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(`
      SELECT 
        i.incident_id,
        i.incident_title,
        it.type_name as incident_type,
        sl.severity_name as severity,
        i.discovered_at,
        asys.system_name as affected_system,
        d.department_name as department,
        i.description,
        i.financial_impact
      FROM incidents i
      JOIN incident_types it ON i.type_id = it.type_id
      JOIN severity_levels sl ON i.severity_id = sl.severity_id
      JOIN affected_systems asys ON i.system_id = asys.system_id
      JOIN reporters r ON i.reporter_id = r.reporter_id
      JOIN departments d ON r.department_id = d.department_id
      ORDER BY i.discovered_at DESC
    `);
    connection.release();
    
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch incidents' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const connection = await pool.getConnection();
    
    // First get or create the necessary IDs
    const [typeResult] = await connection.query(
      'SELECT type_id FROM incident_types WHERE type_name = ?',
      [data.incident_type]
    );
    const typeId = typeResult[0]?.type_id;

    const [severityResult] = await connection.query(
      'SELECT severity_id FROM severity_levels WHERE severity_name = ?',
      [data.severity]
    );
    const severityId = severityResult[0]?.severity_id;

    const [systemResult] = await connection.query(
      'SELECT system_id FROM affected_systems WHERE system_name = ?',
      [data.affected_system]
    );
    const systemId = systemResult[0]?.system_id;

    // Insert the incident
    const [result] = await connection.query(
      `INSERT INTO incidents (
        incident_title,
        type_id,
        severity_id,
        system_id,
        reporter_id,
        status_id,
        discovered_at,
        reported_at,
        description
      ) VALUES (?, ?, ?, ?, 1, 1, NOW(), NOW(), ?)`,
      [
        data.title,
        typeId,
        severityId,
        systemId,
        data.description
      ]
    );

    connection.release();
    
    return NextResponse.json({ 
      success: true,
      message: 'Incident reported successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to report incident' },
      { status: 500 }
    );
  }
} 