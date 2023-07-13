import React from 'react';
import { NavBar } from './NavBar';
import { Wrapper, WrapperVariant } from './Wrapper';

interface LayoutProps {
  children: any;
  variant?: WrapperVariant;
}

export const Layout: React.FC<LayoutProps> = ({ children, variant }) => {
  return (
    <div>
      <NavBar />
      <Wrapper variant={variant}>{children}</Wrapper>
    </div>
  );
};
