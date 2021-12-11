import React, { useEffect } from 'react';
import styles from './index.less';
import { AuthService, LoginParamsType } from '@/service/auth.service';
import { LockOutlined, SafetyOutlined, UserOutlined } from '@ant-design/icons';
import { history, Link } from 'umi';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { message as antdMessage } from 'antd';
import { TokenService } from '@/service/token.service';

const Content: React.FC = () => {
  useEffect(() => {
    const authToken = TokenService.getAuthToken();
    if (authToken) {
      history.push('/');
    }
  }, []);

  async function handleSubmit(loginParams: LoginParamsType): Promise<void> {
    try {
      const { ret: token } = await AuthService.login(loginParams);
      TokenService.saveAuthToken(token);
      antdMessage.success('登入成功!');
      history.push('/dashboard')
    } catch (err) {
      antdMessage.error(err.message);
    }
  }

  return (
    <div className={styles.main}>
      <ProForm
        initialValues={{
          autoLogin: true,
        }}
        submitter={{
          render: (_, dom) => dom.pop(),
          submitButtonProps: {
            loading: false,
            size: 'large',
            style: {
              width: '100%',
            },
          },
        }}
        onFinish={async (values) => {
          await handleSubmit(values as LoginParamsType);
          return Promise.resolve();
        }}
      >
        <>
          <ProFormText
            name="username"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined className={styles.prefixIcon}/>,
            }}
            placeholder="用户名"
            rules={[
              { required: true, message: '请输入用户名!' },
            ]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined className={styles.prefixIcon}/>,
            }}
            placeholder="密码"
            rules={[
              { required: true, message: '请输入密码！' },
            ]}
          />
          <ProFormText
            name="otp"
            fieldProps={{
              size: 'large',
              prefix: <SafetyOutlined className={styles.prefixIcon}/>,
            }}
            placeholder="OTP"
            rules={[
              { required: true, message: '请输入OTP!' },
              { min: 6, message: '请输入六位码!' },
            ]}
          />
        </>
      </ProForm>
    </div>
  );
};

export default function Login() {
  return (
    <div>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                {/* todo logo svg圖片*/}
                {/*<img alt="logo" className={styles.logo} src={logo} />*/}
                <span className={styles.title}>eth_system</span>
              </Link>
            </div>
            <div className={styles.desc}>
            </div>
          </div>
          <Content/>
        </div>
      </div>
    </div>
  );
}
