"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function AOSInitializer() {
  const pathname = usePathname();
  useEffect(() => {
    if (typeof window !== "undefined" && window.AOS) {
      window.AOS.init({
        duration: 1200,
        once: true,
        disable: "mobile",
      });
    }
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined" && window.AOS) {
      window.AOS.refresh();
    }
  }, [pathname]);
  return null;
}