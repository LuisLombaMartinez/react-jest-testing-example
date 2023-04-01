import ReactDOM from 'react-dom/client';
import './index.css';
import LoginService from './services/LoginService';
import LoginComponent from './LoginComponent';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const loginService = new LoginService();

const setToken = (token: string) => {
  console.log(`received token: ${token}`);
}

  root.render(
    <LoginComponent loginService={loginService} setToken={setToken}/>

  );


