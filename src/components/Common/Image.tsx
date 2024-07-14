import React, { useMemo, useState } from 'react';
import NextImage, { type ImageProps as NextImageProps } from 'next/image';

export type ImageProps = NextImageProps & {
  fallbackSrc?: string;
  disableRightClick?: boolean;
};

const placeholderSrc = '/images/img-placeholder.png';

export default function Image({
  src,
  fallbackSrc = placeholderSrc,
  loading = 'lazy',
  quality = 100,
  disableRightClick,
  ...rest
}: ImageProps): React.ReactElement {
  const [hasError, setHasError] = useState(false);

  const imgSrc = useMemo(() => {
    if (!src || hasError) return fallbackSrc;
    return src;
  }, [hasError, fallbackSrc, src]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
    }
  };

  return (
    <NextImage
      {...rest}
      src={imgSrc}
      quality={quality}
      onError={handleError}
      loading={loading}
      onContextMenu={
        disableRightClick
          ? (event) => {
              event.preventDefault();
            }
          : rest.onContextMenu
      }
    />
  );
}
