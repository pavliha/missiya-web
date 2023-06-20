import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

import type { FC, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

export const Layout: FC<Props> = ({ children, className }) => (
  <main className={twMerge(['flex flex-col h-screen relative', className])}>
    <div className="absolute ml-6 mt-6 h-[56px] w-[96px] self-start">
      <Image src="/logo.svg" fill alt="Logo" />
    </div>
    {children}
  </main>
);
