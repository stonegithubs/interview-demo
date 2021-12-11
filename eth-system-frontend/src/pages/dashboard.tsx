import { history } from 'umi';
import { useEffect, useState } from 'react';
import { AuthService } from '@/service/auth.service';
import { TokenService } from '@/service/token.service';
import { PageContainer } from '@ant-design/pro-layout';

export default function IndexPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getIsLogin = async () => {
      try {
        const isLogin = await AuthService.isLogin();
        if (!isLogin) {
          TokenService.removeAuthToken();
          return history.push('/login');
        }

        setLoading(false);
      } catch (err) {
        return history.push('/login');
      }
    };
    getIsLogin();
  }, []);

  if (loading) {
    return <>Loading...</>;
  }

  return (
    <PageContainer>
      Dashboard todo
    </PageContainer>
  );
}
