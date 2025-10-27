// src/hooks/useRegisterForm.ts

import { useState } from "react"
import type { FormData } from "../interfaces/RegisterForm.interface"

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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

  const isEmailUnique = (email: string) => {
    try {
      const raw = localStorage.getItem("users")
      if (!raw) return true
      const users = JSON.parse(raw) as Array<{ email: string }>
      return !users.some((u) => u.email.toLowerCase() === email.toLowerCase())
    } catch {
      return true
    }
  }

  const validate = () => {
    const newErrors: Partial<FormData> = {}
    if (!form.fullName.trim()) newErrors.fullName = "Họ và tên không được để trống"
    if (!form.email.trim()) newErrors.email = "Email không được để trống"
    else if (!emailRegex.test(form.email)) newErrors.email = "Email không hợp lệ"
    else if (!isEmailUnique(form.email)) newErrors.email = "Email đã tồn tại"
    if (!form.password) newErrors.password = "Mật khẩu không được để trống"
    else if (form.password.length < 8) newErrors.password = "Mật khẩu tối thiểu 8 ký tự"
    if (form.confirmPassword !== form.password)
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent, onSuccess: () => void) => {
    e.preventDefault()
    const ok = validate()
    if (ok) {
      onSuccess()
      setForm({ fullName: "", email: "", password: "", confirmPassword: "" })
      setErrors({})
    }
    return ok
  }

  return {
    form,
    errors,
    handleChange,
    handleSubmit
  }
}
