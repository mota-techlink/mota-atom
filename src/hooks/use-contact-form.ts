// src/hooks/use-contact-form.ts
"use client"

import { useState, useTransition } from "react"

export type ContactFormData = {
  firstName: string; // 必填
  lastName?: string;
  email: string;
  message: string;
  type?: 'general' | 'sales';
  productName?: string;
  tier?: string;
}

export function useContactForm() {
  const [isPending, startTransition] = useTransition()
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitForm = async (data: ContactFormData) => {
    setError(null)
    
    startTransition(async () => {
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        const result = await res.json();

        if (res.ok && result.success) {
          setSuccess(true);
        } else {
          // 如果后端返回具体字段错误，这里可以处理得更细致，暂时笼统显示
          const msg = result.message || "Failed to send message";
          const details = result.errors ? JSON.stringify(result.errors) : "";
          setError(details ? `${msg} (${details})` : msg);
        }
      } catch (err) {
        console.error(err);
        setError("An unexpected error occurred. Please try again.");
      }
    })
  }

  const resetForm = () => {
    setSuccess(false)
    setError(null)
  }

  return { isPending, success, error, submitForm, resetForm }
}