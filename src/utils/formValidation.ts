import type { FormDataType, FormErrors } from "../types/Types";

export const formValidation = (
  isSignup: boolean, formData:FormDataType, 
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>
  ) => {
  const newErrors: FormErrors = {};

  if (!formData.email) {
    newErrors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = 'Email is invalid';
  }

  if (!formData.password) {
    newErrors.password = 'Password is required';
  } else if (formData.password.length < 6) {
    newErrors.password = 'Password must be at least 6 characters';
  }

  if (isSignup) {
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
  }

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};
