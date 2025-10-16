// src/pages/Register.tsx

import RegisterForm from "../components/RegisterForm";

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] font-[Poppins]">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;
