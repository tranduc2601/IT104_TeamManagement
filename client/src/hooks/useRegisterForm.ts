// src/hooks/useRegisterForm.ts

import { useState } from "react"
import type { FormData } from "../interfaces/RegisterForm.interface"

export const useRegisterForm = () => {
  const [form, setForm] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  })

  const [errors, setErrors] = useState<Partial<FormData>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const validate = () => {
    const newErrors: Partial<FormData> = {}
    if (!form.fullName.trim())
      newErrors.fullName = "Họ và tên không được để trống"
    if (!form.email.includes("@")) newErrors.email = "Email không hợp lệ"
    if (form.password.length < 6)
      newErrors.password = "Mật khẩu tối thiểu 6 ký tự"
    if (form.confirmPassword !== form.password)
      newErrors.confirmPassword = "Mật khẩu không khớp"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent, onSuccess: () => void) => {
    e.preventDefault()
    if (validate()) {
      onSuccess()
      setForm({ fullName: "", email: "", password: "", confirmPassword: "" })
      setErrors({})
    }
  }

  return {
    form,
    errors,
    handleChange,
    handleSubmit
  }
}
