import { Redirect } from 'umi';
import { TokenService } from '@/service/token.service';

export default (props: any) => {
  const authToken = TokenService.getAuthToken();
  if (authToken) {
    return <div>{props.children}</div>;
  } else {
    return <Redirect to="/login"/>;
  }
}
