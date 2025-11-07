import React, { useState } from "react";
import "./DynamicForm.css";

interface ValidationRule {
  pattern?: string;
  message?: string;
  minLength?: number;
  maxLength?: number;
}

interface Field {
  label: string;
  name: string;
  type: string;
  required?: boolean;
  options?: string[];
  validation?: ValidationRule;
}

interface Schema {
  title: string;
  fields: Field[];
}

interface DynamicFormProps {
  schema: Schema;
  onSubmit?: (data: Record<string, any>) => void;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ schema, onSubmit }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // clear error on change
  };

  // field-level validation
  const validateField = (field: Field, value: any): string => {
    if (field.required && !value) {
      return `${field.label} is required`;
    }

    // Email auto-validation if type=email
    if (field.type === "email" && value) {
      const emailRegex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
      if (!emailRegex.test(value)) {
        return field.validation?.message || "Please enter a valid email address";
      }
    }

    // Min/Max Length
    if (field.validation?.minLength && value?.length < field.validation.minLength) {
      return `${field.label} must be at least ${field.validation.minLength} characters`;
    }

    if (field.validation?.maxLength && value?.length > field.validation.maxLength) {
      return `${field.label} must not exceed ${field.validation.maxLength} characters`;
    }

    // Pattern validation
    if (field.validation?.pattern && value) {
      const regex = new RegExp(field.validation.pattern);
      if (!regex.test(value)) {
        return field.validation.message || `${field.label} is invalid`;
      }
    }

    return "";
  };

  //Submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    schema.fields.forEach((field) => {
      const error = validateField(field, formData[field.name]);
      if (error) newErrors[field.name] = error;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true);
      onSubmit?.(formData);
      console.log("Form Submitted:", formData);
    } else {
      setSubmitted(false);
    }
  };

  //Render input fields dynamically
  const renderField = (field: Field) => {
    const value = formData[field.name] || "";

    switch (field.type) {
      case "text":
      case "email":
        return (
          <input
            type={field.type}
            name={field.name}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            required={field.required}
            placeholder={`Enter ${field.label}`}
          />
        );

      case "textarea":
        return (
          <textarea
            name={field.name}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            required={field.required}
            placeholder={`Enter ${field.label}`}
          />
        );

      case "date":
        return (
          <input
            type="date"
            name={field.name}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            required={field.required}
          />
        );

      case "dropdown":
        return (
          <select
            name={field.name}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            required={field.required}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );

      case "multiselect":
        return (
          <select
            multiple
            name={field.name}
            value={value}
            onChange={(e) =>
              handleChange(
                field.name,
                Array.from(e.target.selectedOptions, (opt) => opt.value)
              )
            }
          >
            {field.options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );

      case "checkbox":
        return (
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => handleChange(field.name, e.target.checked)}
          />
        );

      default:
        return <input type="text" placeholder={`Unsupported type: ${field.type}`} />;
    }
  };

  return (
    <div className="form-container">
      <h2>{schema.title}</h2>
      <form onSubmit={handleSubmit} noValidate>
        {schema.fields.map((field) => (
          <div key={field.name} className="form-field">
            <label>
              {field.label} {field.required && <span className="required">*</span>}
            </label>
            {renderField(field)}
            {errors[field.name] && <p className="error">{errors[field.name]}</p>}
          </div>
        ))}
        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>

      {submitted && (
        <div className="success">
          <h4>✅ Form Submitted Successfully</h4>
          <pre>{JSON.stringify(formData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default DynamicForm;
