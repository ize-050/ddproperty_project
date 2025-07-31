'use client';

import { useEffect } from 'react';

const SchemaMarkup = ({ schema }) => {
  useEffect(() => {
    // ลบ schema เก่าที่อาจมีอยู่
    const existingSchemas = document.querySelectorAll('script[type="application/ld+json"]');
    existingSchemas.forEach(script => {
      if (script.dataset.schemaType) {
        script.remove();
      }
    });

    // เพิ่ม schema ใหม่
    if (schema) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.dataset.schemaType = 'true';
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    }

    return () => {
      // Cleanup เมื่อ component unmount
      const schemas = document.querySelectorAll('script[data-schema-type="true"]');
      schemas.forEach(script => script.remove());
    };
  }, [schema]);

  return null;
};

export default SchemaMarkup;
