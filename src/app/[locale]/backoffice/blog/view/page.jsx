'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import BackofficeLayout from '@/components/backoffice/layout/BackofficeLayout';
import { toast } from 'react-toastify';
import { useForm, Controller } from 'react-hook-form';
import Swal from 'sweetalert2';

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
    { code: 'en', name: 'ENGLISH (Main)', flag: '🇬🇧' },
    { code: 'th', name: 'THAI', flag: '🇹🇭' },
    { code: 'zh', name: 'CHINESE', flag: '🇨🇳' },
    { code: 'ru', name: 'RUSSIAN', flag: '🇷🇺' },
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


  if (loading) {
    return (
        <BackofficeLayout>
          <div className="blog-page">
            <div className="blog-container text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading blog data...</p>
            </div>
          </div>
        </BackofficeLayout>
    );
  }

  return (
      <BackofficeLayout>
        <div className="blog-page">
          <div className="blog-container">
            <div className="page-header">
              <h1>Views Blog Post</h1>
              <p>Update your blog post with multilingual support</p>
            </div>

            <div className="blog-form">
              {/* Language Tabs */}
              <div className="language-tabs">
                {languages.map((lang) => (
                    <button
                        key={lang.code}
                        type="button"
                        className={`language-tab ${activeLanguage === lang.code ? 'active' : ''}`}
                        onClick={() => handleLanguageChange(lang.code)}
                    >
                      <span className="flag">{lang.flag}</span>
                      <span className="lang-name">{lang.name}</span>
                    </button>
                ))}
              </div>

              {/* Title Input */}
              <div className="form-group">
                <label htmlFor="title">Title*</label>
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
                                  readOnly={true}
                                  {...restField}
                                  onChange={(e) => {
                                    onChange(e);
                                  }}
                                  placeholder={`Enter title in ${languages.find(l => l.code === activeLanguage).name}`}
                                  className={`form-control ${errors[activeLanguage]?.title ? 'is-invalid' : ''}`}
                              />
                          )}
                      />
                    </div>
                ))}
                {errors[activeLanguage]?.title && (
                    <div className="invalid-feedback">{languages.find(l => l.code === activeLanguage).name} title is required</div>
                )}
              </div>

              {/* Rich Text Editor */}
              <div className="form-group editor-container">
                <label htmlFor="content">Content*</label>
                {languages.map((lang) => (
                    <div key={lang.code} style={{ display: activeLanguage === lang.code ? 'block' : 'none' }}>
                      <Controller
                          name={`${lang.code}.content`}
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { onChange, ...restField } }) => (
                              <ReactQuill
                                  theme="snow"
                                  readOnly={true}
                                  {...restField}
                                  onChange={(value) => {
                                    onChange(value)
                                  }}
                                  modules={modules}
                                  placeholder={`Enter content in ${lang.name}`}
                              />
                          )}
                      />
                    </div>
                ))}
                {errors[activeLanguage]?.content && (
                    <div className="invalid-feedback">{languages.find(l => l.code === activeLanguage).name} content is required</div>
                )}
              </div>

              {/* Featured Image */}
              <div className="form-group">
                <label>Feature Image</label>
                <Controller
                    name="featuredImage"
                    control={control}
                    render={({ field }) => (
                        <ImageUploader
                            image={field.value || imagePreview}
                            onImageChange={handleImageUpload}
                            placeholderText="Upload/Drag photos of your blog"
                            hintText="Recommended width is at least 1080px"
                        />
                    )}
                />
                {errors.featuredImage && !imagePreview && (
                    <div className="invalid-feedback">Featured image is required</div>
                )}
              </div>

              {/* Submit Button */}
              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={() => router.push('/backoffice/blog')}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </BackofficeLayout>
  );
};

export default EditBlogPage;
