import { useState } from "react";

const Form = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");

  // 🔍 Validation function
  const validate = (data) => {
    const newErrors = {};

    // Name
    if (!data.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (data.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    }

    // Email
    if (!data.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
      newErrors.email = "Invalid email format.";
    }

    // Message
    if (!data.message.trim()) {
      newErrors.message = "Message is required.";
    } else if (data.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters.";
    } else if (data.message.length > 1000) {
      newErrors.message = "Message is too long.";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const updated = {
      ...formData,
      [e.target.name]: e.target.value,
    };

    setFormData(updated);

    // 🔄 Live validation
    setErrors(validate(updated));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed");

      setStatus("Message sent! We will get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
      setErrors({});
    } catch (err) {
      setStatus("Something went wrong.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* NAME */}
      <input
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}

      {/* EMAIL */}
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}

      {/* MESSAGE */}
      <textarea
        name="message"
        placeholder="Message"
        value={formData.message}
        onChange={handleChange}
        required
      />
      {errors.message && <p style={{ color: "red" }}>{errors.message}</p>}

      <button className="amazon-cart-btn" type="submit" style={{ marginTop: "10px" }}>
        Send
      </button>

      {status && <p style={{ marginTop: "10px" }}>{status}</p>}
    </form>
  );
};

export default Form;
