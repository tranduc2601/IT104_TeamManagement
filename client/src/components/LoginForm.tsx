import { useNavigate } from "react-router-dom";
import { useLoginForm } from "../hooks/useLoginForm";
import InputField from "./InputField";
import { Link } from "react-router-dom";
import "./../styles/LoginForm.css";
import { useToast } from "../context/ToastContext";

const LoginForm = () => {
  const navigate = useNavigate();
  const { form, errors, handleChange, handleSubmit } = useLoginForm();
  const { showToast } = useToast();

  const onSuccess = () => {
    showToast({ type: "success", title: "Thành công", message: "Đăng nhập thành công" });
    navigate("/projects");
  };

  const submit = (e: React.FormEvent) => {
    const ok = handleSubmit(e, onSuccess);
    if (!ok) {
      // validation or credential error
      const first = Object.values(errors).find(Boolean) as string | undefined;
      showToast({ type: "error", title: "Lỗi", message: first ?? "Thông tin đăng nhập không đúng" });
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={submit} className="login-form">
        <h6>Email</h6>
        <InputField
          name="email"
          type="email"
          placeholder="Địa chỉ email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
        />
        <h6>Mật khẩu</h6>
        <InputField
          name="password"
          type="password"
          placeholder="Mật khẩu"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
        />

        <button type="submit">Đăng nhập</button>

        <p className="register-link">
          Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
