'use client';

import { useState } from 'react';

export default function Home() {
  const [emails, setEmails] = useState<string[]>(['']);

  const handleChange = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const handleAdd = () => {
    setEmails([...emails, '']);
  };

  const handleRemove = (index: number) => {
    const newEmails = [...emails];
    newEmails.splice(index, 1);
    setEmails(newEmails.length === 0 ? [''] : newEmails);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('https://sendgrid-ax0i.onrender.com/send-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emails }),
      });

      const result = await response.json();
      if (result.success) {
        alert('Emails sent successfully!');
      } else {
        alert('Error sending emails: ' + result.error);
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while sending emails.');
    }
  };

  return (
    <main className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ width: '100%', maxWidth: '500px' }}>
        <h2 className="text-center mb-4">Enter Multiple Emails</h2>
        <form onSubmit={handleSubmit}>
          {emails.map((email, index) => (
            <div key={index} className="input-group mb-3">
              <input
                type="email"
                className="form-control"
                placeholder={`Email ${index + 1}`}
                value={email}
                required
                onChange={(e) => handleChange(index, e.target.value)}
              />
              {emails.length > 1 && (
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => handleRemove(index)}
                >X
                </button>
              )}
            </div>
          ))}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <button type="button" className="btn btn-link" onClick={handleAdd}>
              + Add another email
            </button>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
