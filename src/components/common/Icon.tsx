import type { ComponentType } from 'react';
import type { IconBaseProps } from 'react-icons';

interface IconProps {
  icon: ComponentType<IconBaseProps>;
  className?: string;
  size?: number;
}

export function Icon({ icon: IconComponent, ...props }: IconProps) {
  return <IconComponent {...props} />;
}
