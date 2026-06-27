'use client';

import React from 'react';

export default function AuthEditor() {
  return (
    <div className="p-8 flex flex-col items-center justify-center h-full text-[var(--pm-text-muted)]">
      <div className="text-[24px] mb-2">🔐</div>
      <div className="text-[14px] font-medium">Authorization</div>
      <p className="text-[12px] mt-1 text-center max-w-[280px]">
        Support for Bearer Token, Basic Auth, and API Keys is coming soon in the next version.
      </p>
    </div>
  );
}
