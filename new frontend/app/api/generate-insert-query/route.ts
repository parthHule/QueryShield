import { NextResponse } from 'next/server';
import { API_URL } from '@/app/api/config';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Call our Python backend to generate SQL
    const response = await fetch(`${API_URL}/api/generate-insert-query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to generate SQL query');
    }

    const result = await response.json();
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate SQL query' },
      { status: 500 }
    );
  }
} 