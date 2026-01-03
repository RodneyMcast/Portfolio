import type { ContactField } from "../contactSlice";

type FormFieldProps = {
  id: ContactField;
  label: string;
  value: string;
  error: string | null;
  type?: "text" | "email";
  multiline?: boolean;
  rows?: number;
  onChange: (field: ContactField, value: string) => void;
};

export const FormField = ({
  id,
  label,
  value,
  error,
  type = "text",
  multiline = false,
  rows = 4,
  onChange,
}: FormFieldProps) => {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      {multiline ? (
        <textarea
          id={id}
          value={value}
          rows={rows}
          onChange={(event) => onChange(id, event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(event) => onChange(id, event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
        />
      )}
      {error ? (
        <span className="field-error" id={errorId}>
          {error}
        </span>
      ) : null}
    </div>
  );
};
