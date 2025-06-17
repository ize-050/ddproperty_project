'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-hot-toast';
import { useTranslations } from 'next-intl';
import BackofficeLayout from '@/components/backoffice/layout/BackofficeLayout';
import EditPropertyForm from '@/components/backoffice/property/EditPropertyForm';
import { propertyFormSchemaBasic } from '@/validations/propertyFormSchema';
import usePropertyFormStore from '@/store/propertyFormStore';
import '@/styles/backoffice/add-property.scss';
import '@/styles/backoffice/form-validation.css';


import { useParams } from 'next/navigation';
//lib
import Swal from 'sweetalert2';

const EditProperty = () => {
  const router = useRouter();
  const { id } = useParams();
  const t = useTranslations('AddProperty');
  const { formData, resetForm, setFormData } = usePropertyFormStore();
  const [isLoading, setIsLoading] = useState(false);

  
  // Initialize React Hook Form with Yup schema validation
  const methods = useForm({
    resolver: yupResolver(propertyFormSchemaBasic),
    defaultValues: formData,
    mode: 'onChange',
    reValidateMode: 'onChange'
  });

  
  // Sync form values with Zustand store when form values change
  useEffect(() => {
    const subscription = methods.watch((value, { name, type }) => {
      // Only update specific field that changed to avoid full form reset
      if (name && type === 'change') {
        setFormData(prevData => ({ ...prevData, [name]: value[name] }));
      }
    });
    return () => subscription.unsubscribe();
  }, [methods.watch, formData, setFormData]);

  return (
      <div className="add-property-container">
        <div className="page-header">
          <div className="header-content">
            <div>
              <h1 className="page-title">{t('editPropertyTitle')}</h1>
              <p>{t('editPropertySubtitle')}</p>
            </div>
          </div>
        </div>
            
        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">{t('loadingPropertyData')}</p>
          </div>
        ) : (
          <FormProvider {...methods}>
            <EditPropertyForm propertyId={id} />
          </FormProvider>
        )}
      </div>
  );
};

export default EditProperty;
