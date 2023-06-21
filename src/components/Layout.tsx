import { twMerge } from 'tailwind-merge';

import type { FC, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

export const Layout: FC<Props> = ({ children, className }) => (
  <main className={twMerge(['flex flex-col h-screen relative', className])}>{children}</main>
);
