import React from 'react';
import type { IconType } from 'react-icons';

interface AmenityProps {
  icon: IconType;
  name: string;
  description: string;
}

interface IconBaseProps extends React.SVGAttributes<SVGElement> {
  children?: React.ReactNode;
  size?: string | number;
  color?: string;
  title?: string;
}

export const AmenitiesSection: React.FC<{ amenities: AmenityProps[] }> = ({ amenities }) => {
  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-serif text-heritage-green text-center mb-12">Our Amenities</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {amenities.map(({ icon: Icon, name, description }) => {
            const IconComponent = Icon as React.ComponentType<IconBaseProps>;
            return (
              <div key={name} className="text-center">
                <IconComponent className="w-12 h-12 mx-auto text-heritage-green mb-4" />
                <h3 className="font-semibold mb-2">{name}</h3>
                <p className="text-sm text-gray-600">{description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
