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
      const raw = localStorage.getItem("users");
      const users = raw ? (JSON.parse(raw) as Array<{ email: string; password: string }>) : [];
      const found = users.find(
        (u) => u.email.toLowerCase() === form.email.toLowerCase() && u.password === form.password
      );
      if (!found) {
        setErrors({ email: "Thông tin đăng nhập không đúng" });
        return false;
      }
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
