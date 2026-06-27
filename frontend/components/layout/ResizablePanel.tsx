'use client';

import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import clsx from 'clsx';

interface ResizablePanelProps {
  /** Direction of the split */
  direction: 'horizontal' | 'vertical';
  /** Content of the first panel */
  first: React.ReactNode;
  /** Content of the second panel */
  second: React.ReactNode;
  /** Default size of the first panel (percentage) */
  defaultSizes?: [number, number];
  /** Minimum size of each panel (percentage) */
  minSizes?: [number, number];
  id?: string;
  className?: string;
}

/**
 * ResizablePanel — generic two-panel resizable wrapper using react-resizable-panels.
 */
export function ResizablePanel({
  direction,
  first,
  second,
  defaultSizes = [50, 50],
  minSizes = [20, 20],
  id = 'resizable',
  className,
}: ResizablePanelProps) {
  const handleClass = direction === 'horizontal'
    ? 'w-[3px] bg-surface-800 hover:bg-brand-500/40 transition-colors cursor-col-resize'
    : 'h-[3px] bg-surface-800 hover:bg-brand-500/40 transition-colors cursor-row-resize';

  return (
    <PanelGroup direction={direction} className={clsx('flex-1', className)}>
      <Panel defaultSize={defaultSizes[0]} minSize={minSizes[0]} id={`${id}-a`} order={1}>
        {first}
      </Panel>
      <PanelResizeHandle className={handleClass} id={`${id}-handle`} />
      <Panel defaultSize={defaultSizes[1]} minSize={minSizes[1]} id={`${id}-b`} order={2}>
        {second}
      </Panel>
    </PanelGroup>
  );
}
