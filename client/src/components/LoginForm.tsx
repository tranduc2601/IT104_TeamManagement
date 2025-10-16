import { useLoginForm } from "../hooks/useLoginForm";
import InputField from "./InputField";
import { Link } from "react-router-dom";

const LoginForm = () => {
  const { form, errors, handleChange, handleSubmit } = useLoginForm();

  const onSuccess = () => {
    alert("Đăng nhập thành công!");
  };

  return (
    <form
      onSubmit={(e) => handleSubmit(e, onSuccess)}
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
  );
};

export default LoginForm;
