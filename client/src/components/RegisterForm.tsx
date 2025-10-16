import { useRegisterForm } from "../hooks/useRegisterForm";
import { Link } from "react-router-dom";
import "../styles/RegisterForm.css";

const RegisterForm = () => {
  const { form, errors, handleChange, handleSubmit } = useRegisterForm();

  const onSuccess = () => {
    alert("Đăng ký thành công!");
  };

  return (
    <div className="register-container">
      <form
        onSubmit={(e) => handleSubmit(e, onSuccess)}
        className="register-form"
      >
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
