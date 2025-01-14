import React, { useState } from "react";

const NewsletterSubscribe = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(`Subscribed with email: ${email}`);
  };

  return (
    <form onSubmit={handleSubscribe} className="newsletter-form">
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit">Subscribe</button>
    </form>
  );
};

export default NewsletterSubscribe;
