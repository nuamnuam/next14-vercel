import React from 'react';

const useForm = (initialState = {} as any) => {
  const [formData, setFormData] = React.useState(initialState);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return { formData, handleInputChange };
};

export default useForm;
