import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Your existing login authentication logic
    
    return NextResponse.json(
      { success: true },
      {
        headers: {
          'Location': '/dashboard'
        },
        status: 200
      }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 401 }
    );
  }
} 