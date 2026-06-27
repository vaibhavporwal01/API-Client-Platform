'use client';

import React from 'react';
import { HttpMethod } from '@/types';

interface MethodSelectorProps {
  value: HttpMethod;
  onChange: (method: HttpMethod) => void;
}

const METHOD_COLORS: Record<string, string> = {
  GET: '#49CC90',
  POST: '#61AFFE',
  PUT: '#FCA130',
  PATCH: '#50E3C2',
  DELETE: '#F93E3E',
  HEAD: '#9012FE',
  OPTIONS: '#0D5AA7',
};

export default function MethodSelector({ value, onChange }: MethodSelectorProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as HttpMethod)}
        className="h-full pl-3 pr-8 py-2 bg-[var(--pm-bg-surface)] border border-[var(--pm-border-strong)] rounded-l-md appearance-none cursor-pointer font-bold text-[13px] outline-none"
        style={{ color: METHOD_COLORS[value] || '#fff' }}
      >
        <option value="GET" style={{ color: METHOD_COLORS.GET }}>GET</option>
        <option value="POST" style={{ color: METHOD_COLORS.POST }}>POST</option>
        <option value="PUT" style={{ color: METHOD_COLORS.PUT }}>PUT</option>
        <option value="PATCH" style={{ color: METHOD_COLORS.PATCH }}>PATCH</option>
        <option value="DELETE" style={{ color: METHOD_COLORS.DELETE }}>DELETE</option>
        <option value="HEAD" style={{ color: METHOD_COLORS.HEAD }}>HEAD</option>
        <option value="OPTIONS" style={{ color: METHOD_COLORS.OPTIONS }}>OPTIONS</option>
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[10px] text-[var(--pm-text-muted)]">
        ▼
      </div>
    </div>
  );
}
