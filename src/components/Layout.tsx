import Image from 'next/image';

import type { FC, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export const Layout: FC<Props> = ({ children }) => {
  return (
    <main className="flex min-h-screen flex-col bg-[#F5F5F5]">
      <div className="mt-3 flex min-h-screen  flex-col  justify-between">
        <div className="relative ml-3 h-[56px] w-[96px] self-start">
          <Image src="/logo.svg" fill alt="Right Arrow" />
        </div>

        <div className="flex flex-col items-center justify-center">{children}</div>

        <div className="h-[136px]" />
      </div>
    </main>
  );
};
