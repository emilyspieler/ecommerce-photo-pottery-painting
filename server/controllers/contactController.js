const Mailgun = require("mailgun.js");
const formData = require("form-data");

const mg = new Mailgun(formData).client({
  username: "api",
  key: process.env.MAILGUN_API_KEY,
});

exports.contact = async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message)
    return res.status(400).json({ error: "All fields required" });

  try {
    await mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from: `Website Contact <${process.env.MAILGUN_FROM}>`,
      to: process.env.MAILGUN_FROM,
      subject: `New Contact Form Submission from ${name}`,
      html: `<h2>New Message</h2>
             <p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong></p>
             <p>${message}</p>`,
    });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send email" });
  }
};