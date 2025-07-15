import nodemailer from 'nodemailer';

// Email configuration
const emailConfig = {
  service: 'gmail', // หรือใช้ SMTP อื่น
  auth: {
    user: process.env.EMAIL_USER, // your-email@gmail.com
    pass: process.env.EMAIL_PASS, // app password (not regular password)
  },
};

// Create transporter
const transporter = nodemailer.createTransporter(emailConfig);

// Verify connection
export const verifyEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log('✅ Email server is ready to send messages');
    return true;
  } catch (error) {
    console.error('❌ Email server connection failed:', error);
    return false;
  }
};

// Send email function
export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const mailOptions = {
      from: {
        name: 'D-Luck Property',
        address: process.env.EMAIL_USER,
      },
      to,
      subject,
      html,
      text: text || '', // fallback text version
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    return { success: false, error: error.message };
  }
};

// Send property inquiry email
export const sendPropertyInquiry = async ({
  propertyId,
  propertyTitle,
  customerName,
  customerEmail,
  customerPhone,
  message,
  agentEmail,
}) => {
  const subject = `Property Inquiry: ${propertyTitle}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #d32f2f;">New Property Inquiry</h2>
      
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Property Details</h3>
        <p><strong>Property ID:</strong> ${propertyId}</p>
        <p><strong>Title:</strong> ${propertyTitle}</p>
      </div>
      
      <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h3 style="margin-top: 0;">Customer Information</h3>
        <p><strong>Name:</strong> ${customerName}</p>
        <p><strong>Email:</strong> ${customerEmail}</p>
        <p><strong>Phone:</strong> ${customerPhone}</p>
        
        <h4>Message:</h4>
        <p style="background: #f9f9f9; padding: 15px; border-left: 4px solid #d32f2f;">
          ${message}
        </p>
      </div>
      
      <div style="margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 8px;">
        <p style="margin: 0; font-size: 14px; color: #666;">
          This inquiry was sent from D-Luck Property website.
        </p>
      </div>
    </div>
  `;

  return await sendEmail({
    to: agentEmail,
    subject,
    html,
  });
};

// Send contact form email
export const sendContactForm = async ({
  name,
  email,
  phone,
  subject,
  message,
}) => {
  const emailSubject = `Contact Form: ${subject}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #d32f2f;">New Contact Form Submission</h2>
      
      <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h3 style="margin-top: 0;">Contact Information</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        
        <h4>Message:</h4>
        <p style="background: #f9f9f9; padding: 15px; border-left: 4px solid #d32f2f;">
          ${message}
        </p>
      </div>
      
      <div style="margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 8px;">
        <p style="margin: 0; font-size: 14px; color: #666;">
          This message was sent from D-Luck Property contact form.
        </p>
      </div>
    </div>
  `;

  return await sendEmail({
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    subject: emailSubject,
    html,
  });
};

export default {
  sendEmail,
  sendPropertyInquiry,
  sendContactForm,
  verifyEmailConnection,
};
