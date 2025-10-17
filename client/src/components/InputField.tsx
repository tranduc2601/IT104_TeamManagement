type InputFieldProps = {
  label?: string;
  type?: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  error?: string;
};

const InputField = ({
  label,
  type = "text",
  name,
  placeholder,
  required,
  onChange,
  value,
  error,
}: InputFieldProps) => {
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={name} className="form-label">
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
        className="form-input"
      />
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default InputField;