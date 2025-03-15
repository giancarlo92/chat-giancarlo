import React from 'react';
import type { ThemeToggleProps } from './ThemeToggle/ThemeToggleTypes';
import ThemeToggleView from './ThemeToggle/ThemeToggleView';

export default function ThemeToggle(props: ThemeToggleProps) {
  return <ThemeToggleView {...props} />;
}
