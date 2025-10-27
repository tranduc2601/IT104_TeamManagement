import { useRegisterForm } from "../hooks/useRegisterForm";
import { Link, useNavigate } from "react-router-dom";
import "../styles/RegisterForm.css";
import { useToast } from "../context/ToastContext";

const RegisterForm = () => {
  const { form, errors, handleChange, handleSubmit } = useRegisterForm();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const onSuccess = () => {
    // persist user to localStorage
    try {
      const raw = localStorage.getItem("users");
      const users = raw ? JSON.parse(raw) : [];
      users.push({ fullName: form.fullName, email: form.email, password: form.password });
      localStorage.setItem("users", JSON.stringify(users));
    } catch {
      // ignore storage error
    }
    showToast({ type: "success", title: "Thành công", message: "Đăng ký thành công" });
    navigate("/projects");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    const ok = handleSubmit(e, onSuccess);
    if (!ok) {
      // show first error message as toast
      const firstError = Object.values(errors).find(Boolean) as string | undefined;
      showToast({ type: "error", title: "Lỗi", message: firstError ?? "Thông tin không hợp lệ" });
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleFormSubmit} className="register-form">
        <h1 className="title">Đăng ký</h1>

        <input
          type="text"
          name="fullName"
          placeholder="Họ và tên"
          value={form.fullName}
          onChange={handleChange}
          className="center-placeholder"
        />

        {errors.fullName && <p className="error">{errors.fullName}</p>}

        <input
          type="email"
          name="email"
          placeholder="Địa chỉ email"
          value={form.email}
          onChange={handleChange}
          className="center-placeholder"
        />
        {errors.email && <p className="error">{errors.email}</p>}

        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={form.password}
          onChange={handleChange}
          className="center-placeholder"
        />
        {errors.password && <p className="error">{errors.password}</p>}

        <input
          type="password"
          name="confirmPassword"
          placeholder="Xác nhận mật khẩu"
          value={form.confirmPassword}
          onChange={handleChange}
          className="center-placeholder"
        />
        {errors.confirmPassword && (
          <p className="error">{errors.confirmPassword}</p>
        )}

        <button type="submit">Đăng ký</button>

        <p className="login-link">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;
