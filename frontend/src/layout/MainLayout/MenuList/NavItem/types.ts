import { ReactElement, ElementType } from 'react';

export interface NavItemProps {
  item: {
    id: string;
    title: string;
    caption?: string;
    url?: string;
    icon?: ElementType;
    external?: boolean;
    target?: string;
    disabled?: boolean;
    chip?: {
      color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
      variant: 'filled' | 'outlined';
      size: 'small' | 'medium';
      label: string;
      avatar?: ReactElement;
    };
  };
  level: number;
  parentId: string;
  setSelectedID: (id: string) => void;
} 