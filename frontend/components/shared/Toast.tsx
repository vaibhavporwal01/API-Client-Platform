'use client';

import React from 'react';
import toast, { Toaster } from 'react-hot-toast';

export const showToast = {
  success: (msg: string) => toast.success(msg, {
    iconTheme: { primary: '#49CC90', secondary: '#fff' }
  }),
  error: (msg: string) => toast.error(msg, {
    iconTheme: { primary: '#F93E3E', secondary: '#fff' }
  }),
  info: (msg: string) => toast(msg, {
    icon: 'ℹ️'
  })
};

export default function Toast() {
  return null; // The <Toaster /> is in the root layout.tsx
}
