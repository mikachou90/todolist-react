import {
  AuthContainer,
  AuthInputContainer,
  AuthButton,
  AuthLinkText,
} from 'components/common/auth.styled';
import { ACLogoIcon } from 'assets/images';
import { AuthInput } from 'components';
import { useState, useEffect } from 'react';
import { login, checkPermission } from '../api/auth';
import Swal from 'sweetalert2';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleClick = async () => {
    if (username.length === 0) {
      return;
    }
    if (password.length === 0) {
      return;
    }

    const { success, authToken } = await login({
      username,
      password,
    });
    if (success) {
      localStorage.setItem('authToken', authToken);
      Swal.fire({
        position: 'top',
        title: '登入成功！',
        timer: 1500,
        icon: 'success',
        showConfirmButton: false,
      });
      navigate('/todos');
      return;
    }
    Swal.fire({
      position: 'top',
      title: '登入失敗！',
      timer: 1500,
      icon: 'error',
      showConfirmButton: false,
    });
  };

  useEffect(() => {
    const checkTokenIsValid = async () => {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        return;
      }
      const result = await checkPermission(authToken);
      if (result) {
        navigate('/todos');
      }
    };

    checkTokenIsValid();
  }, [navigate]);

  return (
    <AuthContainer>
      <div>
        <ACLogoIcon />
      </div>
      <h1>登入 Todo</h1>

      <AuthInputContainer>
        <AuthInput
          label={'帳號'}
          value={username}
          placeholder={'請輸入帳號'}
          onChange={(nameInputValue) => setUserName(nameInputValue)}
        />
      </AuthInputContainer>

      <AuthInputContainer>
        <AuthInput
          label={'密碼'}
          value={password}
          placeholder={'請輸入密碼'}
          onChange={(passwordInputValue) => setPassword(passwordInputValue)}
        />
      </AuthInputContainer>
      <AuthButton onClick={handleClick}>登入</AuthButton>
      <Link to="/signup">
        <AuthLinkText>註冊</AuthLinkText>
      </Link>
    </AuthContainer>
  );
};

export default LoginPage;
