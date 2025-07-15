import { useState } from 'react';

export const useEmail = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const sendToBackend = async (data, endpoint) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // ส่งข้อมูลไปยัง backend API
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${backendUrl}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
        return { success: true, data: result };
      } else {
        setError(result.message || result.error || 'Failed to send data');
        return { success: false, error: result.message || result.error };
      }
    } catch (err) {
      const errorMessage = err.message || 'Network error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Send property inquiry to backend
  const sendPropertyInquiry = async ({
    propertyId,
    propertyTitle,
    customerName,
    customerEmail,
    customerPhone,
    message,
    agentEmail,
  }) => {
    return await sendToBackend({
      propertyId,
      propertyTitle,
      customerName,
      customerEmail,
      customerPhone,
      message,
      agentEmail,
    }, 'property-inquiry');
  };

  // Send contact form to backend
  const sendContactForm = async ({
    name,
    email,
    phone,
    subject,
    message,
  }) => {
    return await sendToBackend({
      name,
      email,
      phone,
      subject,
      message,
    }, 'contact-form');
  };

  const reset = () => {
    setError(null);
    setSuccess(false);
    setLoading(false);
  };

  return {
    loading,
    error,
    success,
    sendPropertyInquiry,
    sendContactForm,
    reset,
  };
};

export default useEmail;
