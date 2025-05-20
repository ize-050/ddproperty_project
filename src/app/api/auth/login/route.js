import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// This would normally come from a database
const ADMIN_USERS = [
  {
    id: 1,
    email: 'admin@dluckproperty.com',
    // Password: admin123 (hashed)
    password: '$2a$10$XFE/oW.1J.hSFQPXGlMON.eOZO5ysJLPfAg8ht1T09N9t7ZAVNlAO',
    name: 'Admin User',
    role: 'admin'
  }
];

export async function POST(request) {
  try {
    // Parse request body
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = ADMIN_USERS.find(u => u.email === email);

    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    // Return token and user data (excluding password)
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
