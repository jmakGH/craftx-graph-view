import React, { FC } from 'react';

import { styled } from '@/style/stitches.config';

const HeaderBox = styled('div', {
  alignItems: 'center',
  display: 'flex',
  height: '44pt',
});

const HeaderTitle = styled('h1', {
  fontSize: '$heading',
  fontWeight: 700,
});

const Header: FC = ({ children }) => (
  <HeaderBox>
    <HeaderTitle>{children}</HeaderTitle>
  </HeaderBox>
);

export default Header;
