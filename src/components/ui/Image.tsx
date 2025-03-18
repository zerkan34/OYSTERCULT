import React from 'react';
import { cn } from '@/lib/utils';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
  aspectRatio?: 'auto' | 'square' | '16/9' | '4/3';
}

export const Image: React.FC<ImageProps> = ({
  alt = '',
  fallback = 'Image non disponible',
  aspectRatio = 'auto',
  className,
  ...props
}) => {
  const [error, setError] = React.useState(false);

  const aspectRatioClasses = {
    auto: '',
    square: 'aspect-square',
    '16/9': 'aspect-video',
    '4/3': 'aspect-4/3'
  };

  if (error) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center bg-gray-100 text-gray-400 text-sm",
          aspectRatio !== 'auto' && aspectRatioClasses[aspectRatio],
          className
        )}
        role="img"
        aria-label={alt || fallback}
      >
        {fallback}
      </div>
    );
  }

  return (
    <img
      className={cn(
        aspectRatio !== 'auto' && aspectRatioClasses[aspectRatio],
        className
      )}
      alt={alt}
      onError={() => setError(true)}
      {...props}
    />
  );
};
