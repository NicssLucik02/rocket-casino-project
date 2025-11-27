import { useState } from 'react';
import { useForm } from '../../assets/hooks/useForm';
import { PrimaryButton } from '../uikit/Buttons/PrimaryButton';
import { PrimaryInput } from '../uikit/Inputs/Input';
import './loginModule.scss';

export const LoginModule = () => {
  const {formData, handleChange, handleSignup, handleLogin, loginErrors, setLoginErrors} = useForm();
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const changeAuthMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setLoginErrors({
      username: '',
      email: '',
      password: '',
      server: '',
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (mode === 'signup') {
      await handleSignup();
    } else {
      await handleLogin();
    }
  };
  console.log(loginErrors);
  
    return (
      <div className='wrapper'>
        <section className="login">
            <div className="login__container">
              <div className="login__top">
                  <img 
                    src="../../src/assets/icons/RocketLogo.svg" 
                    alt="Rocket Logo" 
                  />
                  <p className="login__top-title">Rocket Casino</p>
                  <p className="login__top-subtitle">Welcome Back</p>
              </div>

                <form onSubmit={handleSubmit} className="login__forms">
                  {mode === 'signup' && (
                    <div>
                      <p className="login__input-text">Username</p>
                      <PrimaryInput 
                        name={'username'}
                        placeholderValue={'Enter Username'} 
                        type={'text'} 
                        bgColor={'rgba(15, 23, 43, 1)'}
                        widthSize={'100'}
                        inputValue={formData.username}
                        handler={handleChange}
                      />
                      {loginErrors.username && (
                          <p className="login__error">
                            {loginErrors.username}
                          </p>
                      )}
                      
                  </div>
                  )}
                  
                <div>
                  <p className="login__input-text">Email</p>
                  <PrimaryInput 
                    name={'email'}
                    placeholderValue={'Enter Email'} 
                    type={'email'} 
                    bgColor={'rgba(15, 23, 43, 1)'}
                    widthSize={'100'}
                    inputValue={formData.email}
                    handler={handleChange}
                  />
                  {loginErrors.email && (
                    <p className="login__error">
                      {loginErrors.email}
                    </p>
                  )}
                  
                  </div>

                  <div>
                  <p className="login__input-text">Password</p>
                  <PrimaryInput 
                    name={'password'}
                    placeholderValue={'Enter Password'} 
                    type={'password'} 
                    bgColor={'rgba(15, 23, 43, 1)'}
                    widthSize={'100'}
                    inputValue={formData.password}
                    handler={handleChange}
                  />
                  {loginErrors.password && (
                    <p className="login__error">
                      {loginErrors.password}
                    </p>
                  )}
                  
                  </div>

                  <PrimaryButton 
                    text={mode === 'login' ? 'Login': 'Registration'} 
                    widthSize={'100'} 
                    bgColor1={'rgba(0, 153, 102, 1)'} 
                    bgColor2={'rgba(21, 93, 252, 1)'}
                    icon={'../../src/assets/icons/Login.svg'}
                  />

                  <p
                    className="login__reg" 
                    onClick={changeAuthMode}>
                      {mode === 'login' ? `Don't have an account? Register` : 'Already have account'}
                  </p>
                  {loginErrors.server && (
                    <p className="login__error">
                      {/* {loginErrors.server === 'Invalid login credentials' && 'This user is not registered'} */}
                      {loginErrors.server}
                    </p>
                  )}
                  
                  
                </form>
                             
              <div className="login__divider"/>
              <p className="login__subtext">
                Your account data is stored locally in your browser
              </p>
          </div>
        </section>
        </div>
    )
}