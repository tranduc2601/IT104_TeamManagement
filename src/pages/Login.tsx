import { useState } from "react";
import InputField from "../components/InputField";
import { Link } from "react-router-dom";

type LoginData = {
  email: string;
  password: string;
};

const Login = () => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      alert("Đăng nhập thành công!");
      setErrors({});
    }
  };

  return (
    <div className="min-h-dvh flex items-center justify-center bg-[#F8FAFC] font-[Poppins]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-md space-y-4"
      >

        <h1 className="text-center text-2xl font-semibold text-gray-800">
          Đăng nhập
        </h1>

        <InputField
          label="Email"
          name="email"
          type="email"
          placeholder="Địa chỉ email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
        />

        <InputField
          label="Mật khẩu"
          name="password"
          type="password"
          placeholder="Mật khẩu"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
        />

        <button
          type="submit"
          className="w-full rounded-lg bg-[#0D6EFD] py-2 text-white font-medium hover:bg-blue-600 transition-colors"
        >
          Đăng nhập
        </button>

        <p className="text-center text-sm text-gray-600">
          Chưa có tài khoản?{" "}
          <Link
            to="/register"
            className="text-[#0D6EFD] font-medium hover:underline"
          >
            Đăng ký
          </Link>
        </p>
      </form>
    </div>
    
  );
};

export default Login;
