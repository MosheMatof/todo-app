import { GoogleLogin} from '@react-oauth/google';
import {message, Flex} from 'antd';
import { useAuth } from '../contexts/AuthContext';
import {useNavigate} from 'react-router-dom';

function GoogleLoginButton(){
  const { googleLogin } = useAuth();
  const navigate = useNavigate();

  const onSuccessGoogleLogin = async (credentialResponse: any) => {
    const user = await googleLogin(credentialResponse);
    if (user) {
      message.success('Login Successfully');
      navigate('/');
    } else {
      message.error('Login Failed');
    }
  };
  return (
    <Flex justify='center'>
      <GoogleLogin
        onSuccess={onSuccessGoogleLogin}
        onError={() => {
          console.log('Login Failed');
          message.error('Login Failed');
        }}
        useOneTap
      />    
    </Flex>
  );
}

export default GoogleLoginButton;

// function GoogleLoginButton(){
//   const { googleLogin } = useAuth();
//   const navigate = useNavigate();

//   const login = useGoogleLogin({
//     onSuccess: async ({ code }: CodeResponse) => {
//         googleLogin(code);
//     },
//     onError: (errorResponse) => {
//       console.log(errorResponse.error, errorResponse.error_description);
//       message.error('Login Failed');
//     },
//     flow: 'auth-code',
//   });  

//   return (
//     <Button
//       onClick={login}
//     />
//   );
// }
