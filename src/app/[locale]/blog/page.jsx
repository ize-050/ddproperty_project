import Image from 'next/image';
import Link from 'next/link';
import { getTranslations, getLocale } from 'next-intl/server';
import MobileMenu from '@/components/common/mobile-menu';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import DynamicBlogContent from '@/components/blog/DynamicBlogContent';
import serverApi from '@/utils/serverApi';
import '@/styles/blog.scss';

export const metadata = {
  title: 'Blog | DD Property',
};

async function fetchBlogs() {
  const target = `${process.env.NEXT_PUBLIC_API_URL}/blogs`;
  console.log('[BLOG-LIST] ▶ fetching', { target });

  try {
    // ใช้ serverApi (axios) เหมือนหน้า home -> ได้ httpsAgent + error interceptor เชิงลึก
    const data = await serverApi.get('/blogs');
    const blogs = data?.data || [];

    console.log('[BLOG-LIST] ✅ success', { count: blogs.length });
    return blogs;
  } catch (error) {
    // interceptor ได้ log '[serverApi] ❌ request failed' เชิงลึกไว้แล้ว
    console.error('[BLOG-LIST] ❌ failed', {
      target,
      status: error?.status,
      message: error?.message,
      data: error?.data,
    });
    return [];
  }
}

export default async function BlogPage({ searchParams, params }) {
  const blogs = await fetchBlogs();
  console.log('Fetched blogs:', blogs);
  const locale = params.locale;

  // จัดการ pagination
  const ITEMS_PER_PAGE = 10;
  const page = searchParams?.page ? parseInt(searchParams.page) : 1;
  const totalPages = Math.ceil(blogs.length / ITEMS_PER_PAGE);
  console.log("totalPages",totalPages);

  // แยกบทความที่จะแสดงในส่วนต่างๆ
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPageBlogs = blogs.slice(startIndex, endIndex);

  // 3 บทความล่าสุดสำหรับ sidebar
  const latestPosts = blogs.slice(0, 3);

  return (
    <DynamicBlogContent
      blogs={blogs}
      currentPageBlogs={currentPageBlogs}
      latestPosts={latestPosts}
      totalPages={totalPages}
      page={page}
      locale={locale}
    />
  );
}
