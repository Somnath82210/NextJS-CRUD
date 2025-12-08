import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { User } from '../types/types';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Read users from file
    const filePath = path.join(process.cwd(), 'utils', 'users.json');
    const fileContent = await readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    const users = data.users || [];

    // Find user
    const user = users.find((u: User) => u.email === email && u.password === password);

    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      return NextResponse.json({
        success: true,
        message: 'Authentication successful',
        user: userWithoutPassword
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid email or password' },
      { status: 401 }
    );

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}