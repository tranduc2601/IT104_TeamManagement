import { useState } from "react";

export type LoginData = {
  email: string;
  password: string;
};

export const useLoginForm = () => {
  const [form, setForm] = useState<LoginData>({ email: "", password: "" });
  const [errors, setErrors] = useState<Partial<LoginData>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors: Partial<LoginData> = {};
    if (!form.email.includes("@")) newErrors.email = "Email không hợp lệ";
    if (form.password.length < 6)
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (
    e: React.FormEvent,
    onSuccess: () => void
  ) => {
    e.preventDefault();
    if (validate()) {
      onSuccess();
      setErrors({});
    }
  };

  return {
    form,
    errors,
    handleChange,
    handleSubmit,
  };
};
