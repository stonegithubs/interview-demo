import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, message as antdMessage } from 'antd';
import React from 'react';
import styles from './index.less';
import HeaderDropdown from '@/layouts/HeaderDropdown';
import { AuthService } from '@/service/auth.service';
import { TokenService } from '@/service/token.service';
import { history } from '@@/core/history';

export class AvatarDropdown extends React.Component {
  logout() {
    AuthService.logout().then(() => {
      TokenService.removeAuthToken();
      return history.push('/login');
    }).catch(err => {
      antdMessage.error('退出登錄失敗');
      console.log(err);
    });
  }

  render(): React.ReactNode {
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]}>
        <Menu.Item key="logout" onClick={this.logout}>
          <LogoutOutlined/>
          退出登录
        </Menu.Item>
      </Menu>
    );
    return (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar shape="circle" size="small" icon={<UserOutlined/>}/>
        </span>
      </HeaderDropdown>
    );
  }
}
