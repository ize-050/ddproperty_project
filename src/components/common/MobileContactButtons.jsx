'use client';
import React, { useState } from 'react';
import { FaPhone, FaCommentDots, FaEnvelope, FaLine, FaWeixin, FaWhatsapp, FaFacebookMessenger, FaInstagram } from 'react-icons/fa';
import Image from 'next/image';

const MobileContactButtons = () => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleContactPanel = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            {/* Mobile contact container */}
            <div className="mobile-contact-container">

                {/* Floating Social Media Icons - Only visible when open */}
                {isOpen && (
                    <div className="social-float-buttons">
                        <a href="mailto:contact@example.com" aria-label="Email">
                            <img src="/images/icons/mail.svg" alt="mail" width={20} height={20} />
                        </a>
                        <a href="https://line.me/yourlineaccount" target="_blank" rel="noopener noreferrer" aria-label="Line">
                            <img src="/images/icons/line.svg" alt="line" width={20} height={20} />
                        </a>
                        <a href="tel:+66865559999" target="_blank" rel="noopener noreferrer" aria-label="Line">
                            <img src="/images/icons/call.svg" alt="line" width={20} height={20} />
                        </a>
                        <a href="https://wa.me/66865559999" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                            <img src="/images/icons/whatapp.svg" alt="whatapp" width={20} height={20} />
                        </a>
                        <a href="https://m.me/yourfacebookpage" target="_blank" rel="noopener noreferrer" aria-label="Facebook Messenger">
                            <img src="/images/icons/message.svg" alt="message" width={20} height={20} />
                        </a>
                        <a href="https://instagram.com/yourinstagram" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <img src="/images/icons/ig.svg" alt="ig" width={20} height={20} />
                        </a>
                    </div>
                )}

                {/* Fixed Mobile Contact Buttons */}
                <div className="mobile-contact-fixed">
                    <div className="mobile-contact-inner">
                        <div className="contact-question">Got any questions? I'm happy to help.</div>
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

                    <div className="contact-avatar" onClick={toggleContactPanel}>
                        <img
                            src="/images/agent/staff-05.png"
                            alt="Contact Agent"
                            width={50}
                            height={50}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default MobileContactButtons;
