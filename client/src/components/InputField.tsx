type InputFieldProps = {
  label?: string
  type?: string
  name: string
  placeholder?: string
  required?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  value?: string
  error?: string
}

const InputField = ({
  label,
  type = 'text',
  name,
  placeholder,
  required,
  onChange,
  value,
  error,
}: InputFieldProps) => {
  return (
    <div className="flex flex-col">
      {label && (
        <label htmlFor={name} className="mb-1 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        onChange={onChange}
        value={value}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0D6EFD]"
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}

export default InputField
