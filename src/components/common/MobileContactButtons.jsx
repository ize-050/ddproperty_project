'use client';
import React, { useState, useEffect } from 'react';
import { FaPhone, FaCommentDots, FaEnvelope, FaLine, FaWeixin, FaWhatsapp, FaFacebookMessenger, FaInstagram } from 'react-icons/fa';
import Image from 'next/image';
import { getMessagingSettings, transformSettingsToObject, generatePlatformLink, getDefaultSettings } from '@/services/messagingSettings';

const MobileContactButtons = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [settings, setSettings] = useState(getDefaultSettings());
    const [isLoading, setIsLoading] = useState(true);

    const toggleContactPanel = () => {
        setIsOpen(!isOpen);
    };

    // Fetch messaging settings on component mount
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                setIsLoading(true);
                const response = await getMessagingSettings();
                const settingsObj = transformSettingsToObject(response.data);
                
                // Merge with defaults to ensure all platforms have values
                const mergedSettings = { ...getDefaultSettings(), ...settingsObj };
                setSettings(mergedSettings);
            } catch (error) {
                console.error('Failed to fetch messaging settings:', error);
                // Keep default settings on error
                setSettings(getDefaultSettings());
            } finally {
                setIsLoading(false);
            }
        };

        fetchSettings();
    }, []);

    return (
        <>
            {/* Mobile contact container */}
            <div className="mobile-contact-container">

                {/* Floating Social Media Icons - Only visible when open */}
                {isOpen && (
                    <div className="social-float-buttons">
                        {/* Email */}
                        {settings.email && (
                            <a href={generatePlatformLink('email', settings.email)} aria-label="Email">
                                <img src="/images/icons/mail.svg" alt="mail" width={20} height={20} />
                            </a>
                        )}
                        
                        {/* Line */}
                        {settings.line && (
                            <a href={generatePlatformLink('line', settings.line)} target="_blank" rel="noopener noreferrer" aria-label="Line">
                                <img src="/images/icons/line.svg" alt="line" width={20} height={20} />
                            </a>
                        )}
                        
                        {/* Phone Call - using whatsapp number for now */}
                        {settings.whatsapp && (
                            <a href={`tel:${settings.whatsapp.replace(/[^\d+]/g, '')}`} aria-label="Phone Call">
                                <img src="/images/icons/call.svg" alt="call" width={20} height={20} />
                            </a>
                        )}
                        
                        {/* WhatsApp */}
                        {settings.whatsapp && (
                            <a href={generatePlatformLink('whatsapp', settings.whatsapp)} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                                <img src="/images/icons/whatapp.svg" alt="whatsapp" width={20} height={20} />
                            </a>
                        )}
                        
                        {/* Facebook Messenger */}
                        {settings.messenger && (
                            <a href={generatePlatformLink('messenger', settings.messenger)} target="_blank" rel="noopener noreferrer" aria-label="Facebook Messenger">
                                <img src="/images/icons/message.svg" alt="messenger" width={20} height={20} />
                            </a>
                        )}
                        
                        {/* Instagram */}
                        {settings.instagram && (
                            <a href={generatePlatformLink('instagram', settings.instagram)} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                <img src="/images/icons/ig.svg" alt="instagram" width={20} height={20} />
                            </a>
                        )}
                        
                
                    </div>
                )}

                {/* Fixed Mobile Contact Buttons */}
                <div className="mobile-contact-fixed">
                    <div className="mobile-contact-inner">
                        <div className="contact-question">Got any questions? I&#39;m happy to help.</div>
                        <div className="contact-actions">
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    width: '50%',
                                }}
                            >
                                <div className="contact-option-wrapper">
                                    <a href="tel:+66123456789" className="contact-option phone">
                                        <img src="/images/icon/call.svg" alt="call" width={24} height={24} />
                                    </a>
                                </div>

                                <span style={{ marginLeft: '10px', fontWeight: 'bold' }}>Call Now</span>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    width: '50%',
                                }}
                            >
                                <div className="contact-option-wrapper">
                                    <a href="/contact" className="contact-option phone">
                                        <img src="/images/icon/message.svg" alt="message" width={24} height={24} />
                                    </a>
                                </div>

                                <span style={{ marginLeft: '10px', fontWeight: 'bold' }} >Send Message</span>
                            </div>
                        </div>
                    </div>

                    <div className="contact-avatar" onClick={toggleContactPanel} style={{ cursor: 'pointer' }}>
                        <img
                            src="/images/staff/amy_1.jpg"
                            alt="Contact Agent"
                            width={50}
                            height={50}
                            style={{
                                borderRadius: '50%',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                border: '2px solid #fff'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'scale(1.1)';
                                e.target.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)';
                                e.target.style.border = '2px solid #007bff';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'scale(1)';
                                e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                                e.target.style.border = '2px solid #fff';
                            }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default MobileContactButtons;
