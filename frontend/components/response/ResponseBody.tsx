'use client';

import React from 'react';
import { Highlight, themes } from 'prism-react-renderer';

interface ResponseBodyProps {
  body: string;
  isPretty: boolean;
}

export default function ResponseBody({ body, isPretty }: ResponseBodyProps) {
  if (!body) return <div className="p-4 text-[var(--pm-text-muted)] italic">No response body</div>;

  let formattedBody = body;
  let isJson = false;

  if (isPretty) {
    try {
      // Check if it's JSON and format it
      const obj = JSON.parse(body);
      formattedBody = JSON.stringify(obj, null, 2);
      isJson = true;
    } catch {
      isJson = false;
    }
  }

  if (isPretty && isJson) {
    return (
      <div className="p-4 font-mono text-[13px]">
        <Highlight
          theme={themes.vsDark}
          code={formattedBody}
          language="json"
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className={className} style={{ ...style, background: 'transparent' }}>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line, key: i })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token, key })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>
    );
  }

  // Raw or non-JSON fallback
  return (
    <pre className="p-4 font-mono text-[13px] text-[var(--pm-text-primary)] whitespace-pre-wrap break-all selection:bg-[rgba(239,159,39,0.2)] h-full w-full">
      {body}
    </pre>
  );
}
