import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      copyright="Developed by gbnijnugyf for the second time"
      style={{
        background: 'none',
      }}
      links={
        [
          // {
          //   key: 'github',
          //   title: <GithubOutlined />,
          //   href: 'https://github.com',
          //   blankTarget: true,
          // },
        ]
      }
    />
  );
};

export default Footer;
