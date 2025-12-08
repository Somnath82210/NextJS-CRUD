import { NextResponse } from 'next/server';
import { writeFile, readFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';
import { User } from '../types/types';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Define file path in utils folder
    const utilsDir = path.join(process.cwd(), 'utils');
    const filePath = path.join(utilsDir, 'users.json');
    
    // Ensure utils directory exists
    if (!existsSync(utilsDir)) {
      await mkdir(utilsDir, { recursive: true });
    }

    let users: User[] = [];
    
    try {
      const fileContent = await readFile(filePath, 'utf-8');
      const data = JSON.parse(fileContent);
      users = data.users || [];
    } catch (error) {
      // File doesn't exist or is empty, initialize with default user
      users = [
        {
          id: '1',
          email: 'sample@gmail.com',
          password: '1234abcd@',
          name: 'User',
          role: 'Admin'
        }
      ];
    }

    // Check if email already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email already registered' },
        { status: 400 }
      );
    }

    // Generate new user ID
    const maxId = users.reduce((max, user) => {
      const id = parseInt(user.id);
      return id > max ? id : max;
    }, 0);
    const newId = (maxId + 1).toString();

    // Create new user
    const newUser = {
      id: newId,
      email,
      password,
      name,
      role: 'User'
    };

    // Add new user
    users.push(newUser);

    // Write back to file
    await writeFile(
      filePath,
      JSON.stringify({ users }, null, 2),
      'utf-8'
    );

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}