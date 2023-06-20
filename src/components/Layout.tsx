import Image from 'next/image';

import type { FC, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export const Layout: FC<Props> = ({ children }) => (
  <main className="flex flex-col h-screen">
    <div className="relative ml-3 h-[56px] w-[96px] self-start">
      <Image src="/logo.svg" fill alt="Logo" />
    </div>
    <div className="container mx-auto flex flex-col items-center justify-center flex-1">{children}</div>
  </main>
);
