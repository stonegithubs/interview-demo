import React, { useState } from 'react';
import { Link } from 'umi';
import type { BasicLayoutProps as ProLayoutProps, MenuDataItem, ProSettings, Settings } from '@ant-design/pro-layout';
import ProLayout from '@ant-design/pro-layout';
import menu from './menu';
import { AvatarDropdown } from '@/layouts/AvatarDropdown';

export type DashboardLayoutType = {
  breadcrumbNameMap: Record<string, MenuDataItem>;
  route: ProLayoutProps['route'] & {
    authority: string[];
  };
  settings: Settings;
} & ProLayoutProps;

const DashboardLayout: React.FC<DashboardLayoutType> = (props) => {
  const {
    children, location = { pathname: '/dashboard' }, history,
  } = props;
  const [settings, setSetting] = useState<Partial<ProSettings> | undefined>({ fixSiderbar: true });
  return (
    <>
      <ProLayout
        route={menu}
        location={{ pathname: location.pathname }}
        waterMarkProps={{ content: 'eth_system' }}
        onMenuHeaderClick={(e) => history?.push('/dashboard')}
        menuItemRender={(item, dom) => {
          if (item.target) {
            return <Link to={item.path as string} target="_blank">{item.name}</Link>;
          }
          return <Link to={item.path as string}>{item.name}</Link>;
        }}
        rightContentRender={() => (
          <div>
            <AvatarDropdown/>
          </div>
        )}
        {...settings}
      >
        {children}
      </ProLayout>
    </>
  );
};

export default DashboardLayout;
