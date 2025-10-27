import { useState } from "react";
import { findUserByEmail, setCurrentUser } from "../utils/storage";

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
    if (!form.email.trim()) newErrors.email = "Email không được để trống";
    else if (!form.email.includes("@")) newErrors.email = "Email không hợp lệ";
    if (!form.password) newErrors.password = "Mật khẩu không được để trống";
    else if (form.password.length < 8)
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (
    e: React.FormEvent,
    onSuccess: () => void
  ) => {
    e.preventDefault();
    if (!validate()) return false;

    // check credentials against localStorage users
    try {
      // try to find user in demo storage
      const found = findUserByEmail(form.email);
      if (!found || found.password !== form.password) {
        setErrors({ email: "Thông tin đăng nhập không đúng" });
        return false;
      }
      // set as current user (demo). In production, replace with server-side session/token via axios.
      setCurrentUser(found);
      onSuccess();
      setErrors({});
      return true;
    } catch {
      setErrors({ email: "Lỗi hệ thống. Vui lòng thử lại." });
      return false;
    }
  };

  return {
    form,
    errors,
    handleChange,
    handleSubmit,
  };
};
