import { NextResponse } from 'next/server';
import { sendPropertyInquiry, sendContactForm } from '@/lib/email';

export async function POST(request) {
  try {
    const body = await request.json();
    const { type, ...data } = body;

    let result;

    switch (type) {
      case 'property-inquiry':
        result = await sendPropertyInquiry(data);
        break;
      
      case 'contact-form':
        result = await sendContactForm(data);
        break;
      
      default:
        return NextResponse.json(
          { error: 'Invalid email type' },
          { status: 400 }
        );
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Email sent successfully',
        messageId: result.messageId,
      });
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
