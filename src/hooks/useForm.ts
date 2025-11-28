import { useState } from "react";
import type { FormDataType, FormErrors } from "../types/Types";
import { formValidation } from "../utils/formValidation";
import { supabase } from "../utils/supabaseClient";

export const useForm = () => {
  const [formData, setFormData] = useState<FormDataType>({
    username: '',
    email: '',
    password: ''
  });
  const [loginErrors, setLoginErrors] = useState<FormErrors>({});

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

  setFormData(prev => ({
    ...prev,
    [name]: value,
  }));

    setLoginErrors(prev => ({
      ...prev,
    [name]: '',
    server: '',
  }));
  };

const handleSignup = async () => {
  if (!formValidation(true, formData, setLoginErrors)) return;

    const { error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        username: formData.username,
      },
      
    },
  });

    if (error) {
    setLoginErrors({ server: error.message });
    return;
  }

  setFormData({ username: '', email: '', password: '' });
};


const handleLogin = async () => {
  if (!formValidation(false, formData, setLoginErrors)) return;

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
    
  });

  if (error) {
    setLoginErrors({ server: error.message });
    return;
  }

  const { data } = await supabase.from('profiles').select('*').limit(5)
  console.log(data)
  

  setFormData({email: '', password: '' });
};


const handleLogout = async () => {
  supabase.auth.signOut();
}

return {
    formData,
    handleChange,
    handleSignup,
    handleLogin,
    handleLogout,
    loginErrors,
    setLoginErrors
}
}