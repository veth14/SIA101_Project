import React from 'react';

interface IconProps {
  className?: string;
}

type IconComponent = React.ComponentType<IconProps>;

interface IconWrapperProps {
  icon: IconComponent;
  className?: string;
}

export const IconWrapper = ({ icon: Icon, className }: IconWrapperProps): JSX.Element => {
  return <Icon className={className} />;
};
