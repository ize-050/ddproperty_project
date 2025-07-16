'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import BackofficeLayout from '@/components/backoffice/layout/BackofficeLayout';
import { toast } from 'react-toastify';
import { useForm, Controller } from 'react-hook-form';
import Swal from 'sweetalert2';
import 'flag-icons/css/flag-icons.min.css';
import 'react-toastify/dist/ReactToastify.css';


// Import Components
import ImageUploader from '@/components/common/ImageUploader';

// Import SCSS
import '@/styles/backoffice/blog.scss';

// Rich Text Editor
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';
import axios from "axios";

const EditBlogPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const blogId = searchParams.get('id');
  const t = useTranslations('Blog');
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);

  // State for active language tab
  const [activeLanguage, setActiveLanguage] = useState('en');

  // React Hook Form setup
  const { control, handleSubmit, watch, setValue, reset, formState: { errors }, getValues } = useForm({
    defaultValues: {
      en: { title: '', content: '' },
      th: { title: '', content: '' },
      zh: { title: '', content: '' },
      ru: { title: '', content: '' },
      category: '',
      tags: [],
      featuredImage: null,
    }
  });

  // Watch form values for validation
  const formValues = watch();

  // Language tabs
  const languages = [
    { code: 'en', name: 'ENGLISH (Main)', flagCode: 'gb' },
    { code: 'th', name: 'THAI', flagCode: 'th' },
    { code: 'zh', name: 'CHINESE', flagCode: 'cn' },
    { code: 'ru', name: 'RUSSIAN', flagCode: 'ru' },
  ];

  // Rich text editor modules
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };

  // ดึงข้อมูลบทความจาก API
  useEffect(() => {
    // ตรวจสอบว่ามี localStorage ใน browser หรือไม่ (เพื่อป้องกัน error ใน server-side)
    const hasLocalStorage = typeof window !== 'undefined' && window.localStorage;
    
    if (blogId && hasLocalStorage) {
      fetchBlogData();
    } else if (!blogId) {
      setLoading(false);
      router.push('/backoffice/blog');
    }
  }, [blogId, router]);

  // เพิ่ม useEffect เพื่อ debug ค่าที่ได้จากฟอร์ม
  useEffect(() => {
    if (!loading) {
      console.log('Current form values:', getValues());
    }
  }, [loading, getValues]);

  const fetchBlogData = async () => {
    try {
      setLoading(true);
      console.log('Fetching blog data for ID:', blogId);
      
      // ตรวจสอบว่ามี token หรือไม่
      const token = localStorage.getItem('auth_token');
      if (!token) {
        toast.error('You are not logged in');
        router.push('/backoffice/login');
        return;
      }
      
      // ดึงข้อมูลบทความจาก API
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/blogs/${blogId}`, {
        headers: {
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY,
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('API Response:', response);

      // ตรวจสอบว่ามีข้อมูลใน response หรือไม่
      if (response.data) {
        // ข้อมูลอาจจะอยู่ใน response.data หรือ response.data.data
        const blogData = response.data.data || response.data;
        console.log('Blog data:', blogData);

        reset({
          en: { title: '', content: '' },
          th: { title: '', content: '' },
          zh: { title: '', content: '' },
          ru: { title: '', content: '' },
          category: '',
          tags: []
        });
        
        // กำหนดค่าให้กับฟอร์ม - หัวข้อ
        if (blogData.translatedTitles) {
          let titles;
          try {
            // ถ้า translatedTitles เป็น string และเป็น JSON format
            if (typeof blogData.translatedTitles === 'string') {
              titles = JSON.parse(blogData.translatedTitles);
            } 
            // ถ้า translatedTitles เป็น object อยู่แล้ว
            else if (typeof blogData.translatedTitles === 'object') {
              titles = blogData.translatedTitles;
            }
            // ถ้าไม่ใช่ทั้ง string และ object
            else {
              titles = { en: blogData.title || '', th: '', zh: '', ru: '' };
            }
          } catch (error) {
            console.error('Error parsing translatedTitles:', error);
            titles = { en: blogData.title || '', th: '', zh: '', ru: '' };
          }
          
          console.log('Parsed titles:', titles);
            
          setValue('en.title', titles.en || '');
          setValue('th.title', titles.th || '');
          setValue('zh.title', titles.zh || '');
          setValue('ru.title', titles.ru || '');
        } else if (blogData.title) {
          // ถ้าไม่มี translatedTitles แต่มี title
          setValue('en.title', blogData.title);
        }
        
        // กำหนดค่าให้กับฟอร์ม - เนื้อหา
        if (blogData.translatedContents) {
          let contents;
          try {
            // ถ้า translatedContents เป็น string และเป็น JSON format
            if (typeof blogData.translatedContents === 'string') {
              try {
                contents = JSON.parse(blogData.translatedContents);
              } catch (e) {
                // ถ้าไม่สามารถแปลงเป็น JSON ได้ ให้ใช้ค่าเดิม
                contents = { en: blogData.content || '', th: '', zh: '', ru: '' };
              }
            } 
            // ถ้า translatedContents เป็น object อยู่แล้ว
            else if (typeof blogData.translatedContents === 'object') {
              contents = blogData.translatedContents;
            }
            // ถ้าไม่ใช่ทั้ง string และ object
            else {
              contents = { en: blogData.content || '', th: '', zh: '', ru: '' };
            }
          } catch (error) {
            console.error('Error parsing translatedContents:', error);
            contents = { en: blogData.content || '', th: '', zh: '', ru: '' };
          }
          
          console.log('Parsed contents:', contents);
          
          // กำหนดค่าให้กับ ReactQuill ในแต่ละภาษา
          setTimeout(() => {
            setValue('en.content', contents.en || '');
            setValue('th.content', contents.th || '');
            setValue('zh.content', contents.zh || '');
            setValue('ru.content', contents.ru || '');
            
            // Log ค่าที่กำหนดให้กับฟอร์ม
            console.log('Form values after setting content:', getValues());
          }, 100);
        } else if (blogData.content) {
          // ถ้าไม่มี translatedContents แต่มี content
          setTimeout(() => {
            setValue('en.content', blogData.content || '');
            console.log('Form values after setting content:', getValues());
          }, 100);
        }
        
        if (blogData.category) {
          setValue('category', blogData.category);
        }
        
        if (blogData.tags) {
          let tags;
          try {
            // ถ้า tags เป็น string และเป็น JSON format
            if (typeof blogData.tags === 'string') {
              tags = JSON.parse(blogData.tags);
            } 
            // ถ้า tags เป็น array อยู่แล้ว
            else if (Array.isArray(blogData.tags)) {
              tags = blogData.tags;
            }
            // ถ้าไม่ใช่ทั้ง string และ array
            else {
              tags = [];
            }
          } catch (error) {
            console.error('Error parsing tags:', error);
            tags = [];
          }
          setValue('tags', tags);
        }
        
        // ตั้งค่ารูปภาพ
        if (blogData.featuredImage) {
          console.log('Featured image:', blogData.featuredImage);
          setImagePreview(blogData.featuredImage);
        }
      } else {
        toast.error('Failed to fetch blog data: No data returned from API');
        router.push('/backoffice/blog');
      }
    } catch (error) {
      console.error('Error fetching blog data:', error);
      toast.error('Error fetching blog data: ' + (error.response?.data?.message || error.message));
      router.push('/backoffice/blog');
    } finally {
      setLoading(false);
    }
  };

  // Handle language change
  const handleLanguageChange = (langCode) => {
    setActiveLanguage(langCode);
  };

  // Handle image upload
  const handleImageUpload = (file, preview) => {
    setValue('featuredImage', file);
    setImagePreview(preview);
  };

  // ฟังก์ชัน onSubmit สำหรับอัปเดตบทความ
  const onSubmit = async (data) => {
    // ตรวจสอบว่าทุกภาษามีข้อมูลครบถ้วน
    let missingFields = false;

    for (const lang of languages) {
      if (!data[lang.code].title || !data[lang.code].content) {
        toast.error(`Please fill in all required fields for ${lang.name}`);
        setActiveLanguage(lang.code);
        missingFields = true;
        break;
      }
    }

    if (missingFields) {
      return;
    }

    if (!data.featuredImage && !imagePreview) {
      toast.error('Featured image is required');
      return;
    }

    // แสดง loading indicator
    Swal.fire({
      title: 'Updating...',
      text: 'Please wait while we update your blog post',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      // สร้าง FormData สำหรับส่งข้อมูล
      const formData = new FormData();
      
      // ข้อมูลภาษาอังกฤษเก็บในฟิลด์ title และ content
      formData.append('title', data.en.title);
      formData.append('content', data.en.content);
      
      // ข้อมูลภาษาอื่นๆ ส่งตามรูปแบบที่ backend คาดหวัง
      formData.append('th[title]', data.th.title);
      formData.append('th[content]', data.th.content);
      
      formData.append('zh[title]', data.zh.title);
      formData.append('zh[content]', data.zh.content);
      
      formData.append('ru[title]', data.ru.title);
      formData.append('ru[content]', data.ru.content);
      
      // เพิ่มข้อมูลหลายภาษาในรูปแบบ JSON เพื่อความปลอดภัย
      const translatedTitles = {
        en: data.en.title,
        th: data.th.title,
        zh: data.zh.title,
        ru: data.ru.title
      };
      
      const translatedContents = {
        en: data.en.content,
        th: data.th.content,
        zh: data.zh.content,
        ru: data.ru.content
      };
      
      formData.append('translated_titles', JSON.stringify(translatedTitles));
      formData.append('translated_contents', JSON.stringify(translatedContents));
      
      // เพิ่มข้อมูลอื่นๆ
      if (data.category) {
        formData.append('category', data.category);
      }
      
      if (data.tags && data.tags.length > 0) {
        formData.append('tags', JSON.stringify(data.tags));
      }
      
      // เพิ่มรูปภาพ (ถ้ามีการเปลี่ยนแปลง)
      if (data.featuredImage) {
        formData.append('featuredImage', data.featuredImage);
      }
      
      // ส่งข้อมูลไปยัง API
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/blogs/${blogId}`, formData, {
        headers: {
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY,
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.status === 200) {
        Swal.fire({
          title: t('sweetAlert.successTitle'),
          text: t('sweetAlert.updateSuccessText'),
          icon: 'success',
          confirmButtonText: t('sweetAlert.confirmButtonText')
        }).then(() => {
          router.push('/backoffice/blog');
        });
      } else {
        throw new Error('Failed to update blog post');
      }
    } catch (error) {
      Swal.close();
      console.error('Error updating blog post:', error);
      Swal.fire({
        title: t('sweetAlert.errorTitle'),
        text: t('sweetAlert.updateErrorText'),
        icon: 'error',
        confirmButtonText: t('sweetAlert.confirmButtonText')
      });
    }
  };

  if (loading) {
    return (
        <div className="blog-page">
          <div className="blog-container text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">{t('loading.text')}</span>
            </div>
            <p className="mt-3">{t('loading.blogData')}</p>
          </div>
        </div>

    );
  }

  return (
      <div className="blog-page">
        <div className="blog-container">
          <div className="page-header">
            <h1>{t('edit')}</h1>
            <p>{t('editSubtitle')}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="blog-form">
            {/* Language Tabs */}
            <div className="language-tabs">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  className={`language-tab ${activeLanguage === lang.code ? 'active' : ''}`}
                  onClick={() => handleLanguageChange(lang.code)}
                >
                 <span
                  className={`fi fi-${lang.flagCode}`}
                  style={{
                    width: '20px',
                    height: '15px',
                    borderRadius: '2px',
                    display: 'inline-block'
                  }}
                ></span>
                  <span className="lang-name">{lang.name}</span>
                </button>
              ))}
            </div>

            {/* Title Input */}
            <div className="form-group">
              <label htmlFor="title">{t('form.titleLabel')}</label>
              {languages.map((lang) => (
                <div key={lang.code} style={{ display: activeLanguage === lang.code ? 'block' : 'none' }}>
                  <Controller
                    name={`${lang.code}.title`}
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, ...restField } }) => (
                      <input
                        type="text"
                        id="title"
                        {...restField}
                        onChange={(e) => {
                          onChange(e);
                        }}
                        placeholder={t('form.titlePlaceholder', { langName: languages.find(l => l.code === activeLanguage).name })}
                        className={`form-control ${errors[activeLanguage]?.title ? 'is-invalid' : ''}`}
                      />
                    )}
                  />
                </div>
              ))}
              {errors[activeLanguage]?.title && (
                <div className="invalid-feedback">{t('form.titleRequired', { langName: languages.find(l => l.code === activeLanguage).name })}</div>
              )}
            </div>

            {/* Rich Text Editor */}
            <div className="form-group editor-container">
              {languages.map((lang) => (
                <div key={lang.code} style={{ display: activeLanguage === lang.code ? 'block' : 'none' }}>
                  <Controller
                    name={`${lang.code}.content`}
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, ...restField } }) => (
                      <ReactQuill
                        theme="snow"
                        {...restField}
                        onChange={(value) => {
                          onChange(value)
                        }}
                        modules={modules}
                        placeholder={t('form.contentPlaceholder', { langName: lang.name })}
                      />
                    )}
                  />
                </div>
              ))}
              {errors[activeLanguage]?.content && (
                <div className="invalid-feedback">{t('form.contentRequired', { langName: languages.find(l => l.code === activeLanguage).name })}</div>
              )}
            </div>

            {/* Featured Image */}
            <div className="form-group">
              <label>{t('form.featuredImageLabel')}</label>
              <Controller
                name="featuredImage"
                control={control}
                render={({ field }) => (
                  <ImageUploader
                    image={field.value || imagePreview}
                    onImageChange={handleImageUpload}
                    placeholderText={t('form.featuredImagePlaceholder')}
                    hintText={t('form.featuredImageHint')}
                  />
                )}
              />
              {errors.featuredImage && !imagePreview && (
                <div className="invalid-feedback">{t('form.featuredImageRequired')}</div>
              )}
            </div>

            {/* Submit Button */}
            <div className="form-actions">
              <button type="button" className="cancel-button" onClick={() => router.push('/backoffice/blog')}>
                {t('form.cancelButton')}
              </button>
              <button type="submit" className="submit-button">
                {t('form.updateButton')}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default EditBlogPage;
