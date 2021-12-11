import React from 'react';
import { TokenService } from '@/service/token.service';
import { SmileOutlined } from '@ant-design/icons';

interface IUserInfo {
  username: string;
  id: number;
  roleId: number;
  privilege: number[];
  iat: number;
  exp: number;
}

function parseJWT(token: string): IUserInfo | boolean {
  let base64Url = token.split('.')[1];
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  let jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  try {
    return JSON.parse(jsonPayload);
  } catch (err) {
    return false;
  }
}

let menu = {};

const authToken = TokenService.getAuthToken();
if (authToken) {
  const userInfo = parseJWT(authToken) as IUserInfo;
  if (userInfo && userInfo.roleId === 2) {
    menu = {
      path: '/',
      routes: [
        {
          path: '/dashboard',
          name: '儀表板',
          icon: <SmileOutlined/>,
        },
        {
          path: '/merchant',
          name: '商號',
          icon: <SmileOutlined/>,
        },
        {
          path: '/entry',
          name: '入款單',
          icon: <SmileOutlined/>,
        },
        {
          path: '/withdrawEntry',
          name: '出款單',
          icon: <SmileOutlined/>,
        },
        {
          path: '/ownerWithdrawEntry',
          name: '提現',
          icon: <SmileOutlined/>,
        },
        // {
        //   path: '/merchant',
        //   name: '商號',
        //   icon: <CrownOutlined/>,
        //   routes: [
        //     {
        //       path: '/admin/sub-page1',
        //       name: '一级页面',
        //       icon: <CrownOutlined/>,
        //     },
        //   ],
        // },
        {
          path: '/admin/docs',
          name: 'API文件',
          icon: <SmileOutlined/>,
          target: '_blank',
        },
        {
          path: '/admin/bullboard',
          name: 'Bull Dashboard',
          icon: <SmileOutlined/>,
          target: '_blank',
        },
      ],
    };
  } else {
    menu = {
      path: '/',
      routes: [
        {
          path: '/dashboard',
          name: '儀表板',
          icon: <SmileOutlined/>,
        },
        {
          path: '/merchant',
          name: '商號',
          icon: <SmileOutlined/>,
        },
        {
          path: '/entry',
          name: '入款單',
          icon: <SmileOutlined/>,
        },
        {
          path: '/withdrawEntry',
          name: '出款單',
          icon: <SmileOutlined/>,
        },
        {
          path: '/ownerWithdrawEntry',
          name: '提現',
          icon: <SmileOutlined/>,
        },
      ],
    };
  }
}

export default menu;
