import React, { useState } from "react";

function Contact() {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent page reload

    setStatus("Sending...");

    const response = await fetch("http://localhost:5000/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, email }),
    });

    const result = await response.json();
    setStatus(result.status); // Show success or error message
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto" }}>
      <h1>Contact Us</h1>
      <p>This form is anonymous unless you choose to include your email.</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="message">Your Message:</label>
        <textarea
          id="message"
          name="message"
          rows="5"
          placeholder="Type your message here..."
          required
          style={{ width: "100%", marginTop: "0.5rem" }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <label htmlFor="email">Your Email (Optional):</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="youremail@example.com"
          style={{ width: "100%", marginTop: "0.5rem" }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit" style={{ marginTop: "1rem" }}>Send</button>
      </form>

      {status && <p style={{ marginTop: "1rem", color: "green" }}>{status}</p>}

      <a href="/" style={{ display: "block", marginTop: "2rem" }}>
        Back to Home
      </a>
    </div>
  );
}

export default Contact;
