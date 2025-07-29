'use client'

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import useSimpleTranslations from '@/hooks/useSimpleTranslations';
import Image from 'next/image';
import ContactModal from '../../../common/ContactModal/ContactModal';


const PropertySidebar = ({ property, primaryListing, formatPrice }) => {
  const t = useTranslations('PropertyDetail');
  const { t: dynamicT } = useSimpleTranslations('listing');
  const propertyAgent = property.contactInfo;
  const userAgent = property.user;
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // ดึงข้อมูลตัวแทนจาก property
  let  agent = {
    ...propertyAgent,
    name :property?.user?.name,
    picture : process.env.NEXT_PUBLIC_IMAGE_URL + '/uploads/profiles/' + property?.user?.picture
  };
  // ฟังก์ชันสำหรับเปิด URL ของ social media
  const openSocialMedia = (url) => {
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    }
  };
  
  return (
    <div className="property-sidebar" style={{
      fontFamily:"__Poppins_c70c06"
    }}>
      {/* Contact Agent Widget */}
      <div className="sidebar-widget contact-agent">
        <h3 className="widget-title">{dynamicT('contact-agent', 'Contact Agent')}</h3>
        
        <div className="agent-profile">
          <div className="agent-avatar">
            <img 
              src={agent?.picture || '/images/listings/agent-1.png'}
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
            <a href={agent.phone ? `tel:${agent.phone.replace(/[^\d+]/g, '')}` : "#"} style={{ textDecoration: 'none', color: 'inherit', display: 'contents' }}>
              <div className="icon">
                <i className="fas fa-phone-alt" style={{ transform: 'scaleX(-1)' }}></i>
              </div>
              <div className="details">
                <h5>{dynamicT('call-us-now', 'Call Us Now')}</h5>
                <p>{agent.phone}</p>
              </div>
            </a>
          </div>
          
          {/* Email */}
          <div className="contact-method">
            <a href={agent.email ? `mailto:${agent.email}` : "#"} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit', display: 'contents' }}>
              <div className="icon">
                <i className="fas fa-envelope"></i>
              </div>
              <div className="details">
                <h5>{dynamicT('drop-a-mail', 'Drop a Mail')}</h5>
                <p>{agent.email}</p>
              </div>
            </a>
          </div>
          
          {/* LINE */}
          <div className="contact-method">
            <a href={agent.lineId ? `https://line.me/ti/p/${agent.lineId}` : "#"} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit', display: 'contents' }}>
              <div className="icon">
                <i className="fab fa-line"></i>
              </div>
              <div className="details">
                <h5>{dynamicT('line', 'LINE')}</h5>
                <p>{agent.lineId}</p>
              </div>
            </a>
          </div>
          
          {/* WeChat */}
          <div className="contact-method">
            <a href={agent.wechatId ? `weixin://dl/chat?${agent.wechatId}` : "#"} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit', display: 'contents' }}>
              <div className="icon">
                <i className="fab fa-weixin"></i>
              </div>
              <div className="details">
                <h5>{dynamicT('wechat', 'WeChat')}</h5>
                <p>{agent.wechatId}</p>
              </div>
            </a>
          </div>
          
          {/* WhatsApp */}
          <div className="contact-method">
            <a href={agent.whatsapp ? `https://wa.me/${agent.whatsapp.replace(/[^\d]/g, '')}` : "#"} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit', display: 'contents' }}>
              <div className="icon">
                <i className="fab fa-whatsapp"></i>
              </div>
              <div className="details">
                <h5>{dynamicT('whatsapp', 'Whatsapp')}</h5>
                <p>{agent.whatsapp}</p>
              </div>
            </a>
          </div>
          
          {/* Facebook */}
          <div className="contact-method">
            <a href={agent.facebook ? `https://m.me/${agent.facebook}` : "#"} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit', display: 'contents' }}>
              <div className="icon">
                <i className="fab fa-facebook-messenger"></i>
              </div>
              <div className="details">
                <h5>{dynamicT('facebook-messenger', 'Facebook Messenger')}</h5>
                <p>{agent.facebook}</p>
              </div>
            </a>
          </div>
          
          {/* Instagram */}
          <div className="contact-method">
            <a href={agent.instagram ? `https://instagram.com/${agent.instagram}` : "#"} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit', display: 'contents' }}>
              <div className="icon">
                <i className="fab fa-instagram"></i>
              </div>
              <div className="details">
                <h5>{dynamicT('instagram', 'Instagram')}</h5>
                <p>{agent.instagram}</p>
              </div>
            </a>
          </div>
        </div>
        
        <button 
          className="btn btn-danger w-100 mt-3"
          style={{
            color:"#fff"
          }}
          onClick={() => setIsContactModalOpen(true)}
        >
         {dynamicT('send-a-message-now', 'Send a Message Now')}
        </button>

        {/* Contact Modal */}
        <ContactModal 
          isOpen={isContactModalOpen} 
          onClose={() => setIsContactModalOpen(false)}
          property={property}
        />
      </div>
      
      {/* Related Properties from Same Zone */}
      
    </div>
  );
};

export default PropertySidebar;
