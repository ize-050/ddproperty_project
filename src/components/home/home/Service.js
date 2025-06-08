import React from "react";

import {useTranslations} from "next-intl";



const Service = () => {
  const t = useTranslations('home');

  const services = [
    {
      icon: "flaticon-security",
      title: t('service.property_management'),
      text: t('service.property_onine'),
    },
    {
      icon: "flaticon-keywording",
      title: t('service.mortgate_service'),
      text: t('service.mortgate_service_description'),
    },
    {
      icon: "flaticon-investment",
      title: t('service.legal_service'),
      text: t('service.legal_service_description'),
    },
  ];

  return (
    <>
      {services.map((service, index) => (
        <div key={index} className="col-sm-6 col-lg-4">
          <div className="iconbox-style9 default-box-shadow1 bgc-white p40 bdrs12 position-relative mb30">
            <span className={`icon fz40 ${service.icon}`} />
            <h4 className="iconbox-title mt20">{service.title}</h4>
            <p className="text mb-0">{service.text}</p>
          </div>
        </div>
      ))}
    </>
  );
};

export default Service;
