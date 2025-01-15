// src/Contact.jsx
import React from 'react';

function Contact() {
  return (
    <div style={{ maxWidth: '600px', margin: '50px auto' }}>
      <h1>Contact Us</h1>
      <p>This form is anonymous unless you choose to include your email.</p>

      <form action="https://formspree.io/f/YOUR_FORMSPREE_ID" method="POST">
        <label htmlFor="message">Your Message:</label>
        <textarea
          id="message"
          name="message"
          rows="5"
          placeholder="Type your message here..."
          required
          style={{ width: '100%', marginTop: '0.5rem' }}
        />
        <label htmlFor="email">Your Email (Optional):</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="youremail@example.com"
          style={{ width: '100%', marginTop: '0.5rem' }}
        />
        <button type="submit" style={{ marginTop: '1rem' }}>Send</button>
      </form>
      <a href="/" style={{ display: 'block', marginTop: '2rem' }}>
        Back to Home
      </a>
    </div>
  );
}

export default Contact;
