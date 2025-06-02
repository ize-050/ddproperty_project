'use client'

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import ContactModal from '../../../common/ContactModal/ContactModal';

const PropertySidebar = ({ property, primaryListing, formatPrice }) => {
  const t = useTranslations('PropertyDetail');
  const propertyAgent = property.contactInfo;
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  console.log("PropertySidebar:", property);
  // ดึงข้อมูลตัวแทนจาก property
  let  agent = {
    ...propertyAgent,
    name :property?.user?.name,
  };
  // ฟังก์ชันสำหรับเปิด URL ของ social media
  const openSocialMedia = (url) => {
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    }
  };
  
  return (
    <div className="property-sidebar">
      {/* Contact Agent Widget */}
      <div className="sidebar-widget contact-agent">
        <h3 className="widget-title">{t('contactAgent')}</h3>
        
        <div className="agent-profile">
          <div className="agent-avatar">
            <img 
              src={agent?.avatar || '/images/listings/agent-1.png'}
              alt={agent?.name}
              className="img-fluid rounded-circle"
            />
          </div>
          <div className="agent-name">
            <h4>{agent.name}</h4>
          </div>
        </div>
        
        <div className="contact-methods">
          {/* Phone */}
          <div className="contact-method">
            <div className="icon">
              <i className="fas fa-phone-alt"></i>
            </div>
            <div className="details">
              <h5>Call Us Now</h5>
              <p>{agent.phone}</p>
            </div>
          </div>
          
          {/* Email */}
          <div className="contact-method">
            <div className="icon">
              <i className="fas fa-envelope"></i>
            </div>
            <div className="details">
              <h5>Drop a Mail</h5>
              <p>{agent.email}</p>
            </div>
          </div>
          
          {/* LINE */}
          <div className="contact-method">
            <div className="icon">
              <i className="fab fa-line"></i>
            </div>
            <div className="details">
              <h5>LINE</h5>
              <p>{agent.line}</p>
            </div>
          </div>
          
          {/* WeChat */}
          <div className="contact-method">
            <div className="icon">
              <i className="fab fa-weixin"></i>
            </div>
            <div className="details">
              <h5>WeChat</h5>
              <p>{agent.wechat}</p>
            </div>
          </div>
          
          {/* WhatsApp */}
          <div className="contact-method">
            <div className="icon">
              <i className="fab fa-whatsapp"></i>
            </div>
            <div className="details">
              <h5>Whatsapp</h5>
              <p>{agent.whatsapp}</p>
            </div>
          </div>
          
          {/* Facebook */}
          <div className="contact-method">
            <div className="icon">
              <i className="fab fa-facebook-messenger"></i>
            </div>
            <div className="details">
              <h5>Facebook Messenger</h5>
              <p>{agent.facebook}</p>
            </div>
          </div>
          
          {/* Instagram */}
          <div className="contact-method">
            <div className="icon">
              <i className="fab fa-instagram"></i>
            </div>
            <div className="details">
              <h5>Instagram</h5>
              <p>{agent.instagram}</p>
            </div>
          </div>
        </div>
        
        <button 
          className="btn btn-danger w-100 mt-3"
          onClick={() => setIsContactModalOpen(true)}
        >
          Send a Message Now
        </button>

        {/* Contact Modal */}
        <ContactModal 
          isOpen={isContactModalOpen} 
          onClose={() => setIsContactModalOpen(false)}
          property={property}
        />
      </div>
    </div>
  );
};

export default PropertySidebar;
