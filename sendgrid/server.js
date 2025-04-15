
const express = require('express');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const app = express();
const PORT = 5000;
const allowedOrigins = [
  'https://sendgrid-yash-santosh-patils-projects.vercel.app/',
  'https://sendgrid-yash-santosh-patils-projects.vercel.app',
  'http://localhost:3000' // for development
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json());

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.post('/send-emails', async (req, res) => {
  // console.log("started backend request");
  // req.res.send("hello");
  const emails = req.body.emails;
  if (!emails || !Array.isArray(emails)) {
    return res.status(400).json({ error: 'Invalid emails array' });
  }

  try {
    const messages = emails.map((email) => ({
      to: email,
      from: 'pruthviraj@techonsy.com', // your verified sender
      subject: 'Testing SendGrid from Next.js + Node',
      text: `Hello ${email}, this is a test email.`,
      html: `<strong>Hello ${email},</strong><br>This is a test email.`,
    }));

    await sgMail.send(messages);
    res.status(200).json({ success: true, message: 'Emails sent successfully' });
  } catch (error) {
    console.error('SendGrid error:', error.response?.body || error.message);
    res.status(500).json({ error: 'Failed to send emails' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
