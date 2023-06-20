import type { ComponentProps, FC } from 'react';
import React from 'react';
import { twMerge } from 'tailwind-merge';

export const PlayButton: FC<ComponentProps<'button'>> = ({ className, ...props }) => {
  return (
    <button
      className={twMerge('absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10', className)}
      {...props}
    >
      <svg fill="#FFFFFF" width="60px" height="60px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12,1A11,11,0,1,0,23,12,11.013,11.013,0,0,0,12,1Zm0,20a9,9,0,1,1,9-9A9.011,9.011,0,0,1,12,21ZM10,8l6,4-6,4Z" />
      </svg>
    </button>
  );
};
