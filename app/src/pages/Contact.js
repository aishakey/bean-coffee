import React from "react";
import "./contact.css";

const Contact = () => {
  return (
    <div className="contact-page">
      <h1>DON'T BE SHY, SAY HI</h1>
      <form className="contact-form">
        <div className="input-group">
          <div className="input-container">
            <label htmlFor="name">name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="enter name"
              required
            />
          </div>
          <div className="input-container">
            <label htmlFor="email">email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="enter email"
              required
            />
          </div>
        </div>
        <div className="textarea-container">
          <label htmlFor="message">message</label>
          <textarea
            id="message"
            name="message"
            placeholder="your message"
            rows="5"
            required
          ></textarea>
        </div>
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Contact;
