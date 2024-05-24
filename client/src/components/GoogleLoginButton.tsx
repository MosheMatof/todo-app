import { GoogleLogin} from '@react-oauth/google';
import {message} from 'antd';

function GoogleLoginButton(){
  return (
    <GoogleLogin
      onSuccess={credentialResponse => {
        console.log(credentialResponse);
        message.success('Login Success');
      }}
      onError={() => {
        console.log('Login Failed');
        message.error('Login Failed');
      }}
      useOneTap
    />
  );
}

export default GoogleLoginButton;