import { useFormik } from 'formik';

export default function AuthForm({
  initialValues,
  onSubmit,
  fields,
  buttonLabel = "Submit",
  message = ""
}) {
  const formik = useFormik({
    initialValues,
    onSubmit,
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      {fields.map(({ name, label, type = "text", as = "input", options }) => (
        <label key={name}>
          {label}
          {as === "select" ? (
            <select
              name={name}
              value={formik.values[name]}
              onChange={formik.handleChange}
            >
              {options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          ) : (
            <input
              name={name}
              type={type}
              value={formik.values[name]}
              onChange={formik.handleChange}
              required
            />
          )}
        </label>
      ))}
      <button type="submit">{buttonLabel}</button>
      {message && <div className="message">{message}</div>}
    </form>
  );
}