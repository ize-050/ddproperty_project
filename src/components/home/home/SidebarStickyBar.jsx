"use client"
import Image from "next/image";
import React, { useState, useEffect } from "react";

// Default fallback data
const defaultSocialIcons = [
  { icon: "fab fa-facebook-f", url: "#", platform: "messenger" },
  { icon: "fab fa-twitter", url: "https://x.com/dluckproperty", platform: "twitter" },
  { icon: "fab fa-instagram", url: "#", platform: "instagram" },
];

const defaultContactInfo = {
  telephone: {
    number: "086-543-2345",
    url: "tel:+660865432345",
  },
  email: {
    address: "info@d-luckproperty.com",
    url: "mailto:info@d-luckproperty.com",
  },
};

const SidebarStickyBar = () => {
  const [contactInfo, setContactInfo] = useState(defaultContactInfo);
  const [socialIcons, setSocialIcons] = useState(defaultSocialIcons);
  const [loading, setLoading] = useState(true);

  // Fetch messaging settings from backend API
  useEffect(() => {
    const fetchMessagingSettings = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messaging-settings`);
        if (response.ok) {
          const settings = await response.json();
          // Update contact info from API
          const updatedContactInfo = { ...defaultContactInfo };
          const updatedSocialIcons = [...defaultSocialIcons];
          settings?.data?.forEach(setting => {
            switch (setting.platform) {
              
              case 'email':
                if (setting.platformValue && setting.isEnabled) {
                  updatedContactInfo.email = {
                    address: setting.platformValue,
                    url: `mailto:${setting.platformValue}`
                  };
                }
                break;
              case 'phone':
                if (setting.platformValue && setting.isEnabled) {
                  updatedContactInfo.telephone = {
                    number: setting.platformValue,
                    url: `tel:${setting.platformValue.replace(/[^+\d]/g, '')}`
                  };
                }
                break;
              case 'messenger':
                if (setting.platformValue && setting.isEnabled) {
                  const facebookIndex = updatedSocialIcons.findIndex(icon => icon.platform === 'messenger');
                  if (facebookIndex !== -1) {
                    updatedSocialIcons[facebookIndex].url = 'https://www.facebook.com/' + setting.platformValue;
                  }
                }
                break;
              case 'instagram':
                if (setting.platformValue && setting.isEnabled) {
                  const instagramIndex = updatedSocialIcons.findIndex(icon => icon.platform === 'instagram');
                  if (instagramIndex !== -1) {
                    updatedSocialIcons[instagramIndex].url =  'https://www.instagram.com/' + setting.platformValue;
                  }
                }
                break;
              case 'twitter':
                if (setting.platformValue && setting.isEnabled) {
                  const twitterIndex = updatedSocialIcons.findIndex(icon => icon.platform === 'twitter');
                  if (twitterIndex !== -1) {
                    updatedSocialIcons[twitterIndex].url = 'https://x.com/dluckproperty';
                  }
                }
                break;
            }
          });
        
          setContactInfo(updatedContactInfo);
          setSocialIcons(updatedSocialIcons);
        }
      } catch (error) {
        console.error('Failed to fetch messaging settings:', error);
        // Keep default values on error
      } finally {
        setLoading(false);
      }
    };

    fetchMessagingSettings();
  }, []);

  if (loading) {
    return (
      <div className="home8-sidebar-wrapper d-none d-xxl-block">
        <div className="wrapper">
          <div className="text-center">
            <i className="fas fa-spinner fa-spin"></i>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home8-sidebar-wrapper d-none d-xxl-block">
      <a
        className="sidemenu-btn filter-btn-right mt35 d-block text-center"
        href="#"
        data-bs-toggle="offcanvas"
        data-bs-target="#SidebarPanel"
        aria-controls="SidebarPanelLabel"
      >
        <Image
          width={25}
          height={9}
          className="contain"
          src="/images/dark-nav-icon.svg"
          alt="nav icon"
        />
      </a>
      <div className="wrapper">
        <a 
          className="tel" 
          href={contactInfo.telephone.url}
          style={{ marginTop: '-20px' }}
          target="_blank"
          rel="noopener noreferrer"
        >
          {contactInfo.telephone.number}
        </a>
        <a 
          className="mail" 
          
          href={contactInfo.email.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {contactInfo.email.address}
        </a>
        <div className="social-style2">
          {socialIcons.map((socialIcon, index) => (
            <a 
              key={index} 
              className="text-center" 
              href={socialIcon.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className={socialIcon.icon + " d-block"} />
            </a>
          ))}
        </div>
        <a href="#explore-property">
          <div className="mouse_scroll at-home8 text-center d-block">
            <Image
              width={20}
              height={105}
              src="/images/about/home-scroll2.png"
              alt="scroll image"
            />
          </div>
        </a>
      </div>
    </div>
  );
};

export default SidebarStickyBar;
