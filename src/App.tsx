import React, { useState } from "react";
import DynamicForm from "./components/DynamicForm";
import "./components/DynamicForm.css";

//User Registration Schema
const userRegistrationSchema = {
  title: "User Registration",
  fields: [
    { label: "Full Name", name: "fullName", type: "text", required: true },
    {
      label: "Email",
      name: "email",
      type: "email",
      required: true,
      validation: {
        pattern: "^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$",
        message: "Invalid email address",
      },
    },
    { label: "Date of Birth", name: "dob", type: "date" },
    {
      label: "Gender",
      name: "gender",
      type: "dropdown",
      options: ["Male", "Female", "Other"],
      required: true,
    },
    {
      label: "Hobbies",
      name: "hobbies",
      type: "multiselect",
      options: ["Reading", "Sports", "Music", "Travel"],
    },
    { label: "Subscribe to newsletter", name: "subscribe", type: "checkbox" },
    { label: "About Yourself", name: "about", type: "textarea" },
  ],
};

// Job Application Schema
const jobApplicationSchema = {
  title: "Job Application",
  fields: [
    { label: "Full Name", name: "fullName", type: "text", required: true },
    {
      label: "Email",
      name: "email",
      type: "email",
      required: true,
      validation: {
        pattern: "^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$",
        message: "Invalid email address",
      },
    },
    {
      label: "Position Applied For",
      name: "position",
      type: "dropdown",
      options: ["Frontend Developer", "Backend Developer", "Designer"],
      required: true,
    },
    {
      label: "Skills",
      name: "skills",
      type: "multiselect",
      options: ["JavaScript", "React", "Node.js", "Angular", "CSS"],
    },
    {
      label: "Experience (Years)",
      name: "experience",
      type: "text",
      required: true,
      validation: {
        pattern: "^[0-9]+$",
        message: "Enter a valid number",
      },
    },
    { label: "Portfolio URL", name: "portfolio", type: "text" },
    { label: "Cover Letter", name: "coverLetter", type: "textarea" },
  ],
};

// Two schemas to choose from
const schemas: Record<string, any> = {
  registration: userRegistrationSchema,
  job: jobApplicationSchema,
};

const App: React.FC = () => {
  const [selectedSchema, setSelectedSchema] = useState("registration");

  return (
    <div className="app-container">
      <div className="header">
        <h2>Dynamic Form Demo</h2>
        <select
          value={selectedSchema}
          onChange={(e) => setSelectedSchema(e.target.value)}
        >
          <option value="registration">User Registration</option>
          <option value="job">Job Application</option>
        </select>
      </div>

      <DynamicForm key={selectedSchema} schema={schemas[selectedSchema]} />
    </div>
  );
};

export default App;
