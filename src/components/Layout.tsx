import type { FC, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export const Layout: FC<Props> = ({ children }) => {
  return (
    <main className="flex min-h-screen flex-col justify-center bg-gradient-to-br from-[#3437D1] to-[#16162E]">
      <div className="flex flex-col items-center justify-center">{children}</div>
    </main>
  );
};
