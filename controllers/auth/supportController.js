import Ticket from '../../model/Ticket.js';
import nodemailer from 'nodemailer';

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.ADMIN_SUPPORT_EMAIL) {
  throw new Error('Missing required environment variables for email configuration.');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Authenticated ticket from applicant
export const submitTicket = async (req, res) => {
  try {
    const { subject, message, applicantEmail } = req.body;

    if (!subject || !message || !applicantEmail) {
      return res.status(400).json({ error: 'Subject, message, and email are required.' });
    }

    console.log('Received ticket submission:', req.body);

    const ticket = new Ticket({ subject, message, applicantEmail });
    await ticket.save();

    await transporter.sendMail({
      from: `"Support Ticket System" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_SUPPORT_EMAIL,
      subject: `New Support Ticket: ${subject}`,
      html: `
        <h2>New Support Ticket</h2>
        <p><strong>From:</strong> ${applicantEmail}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <p><em>Login to the admin panel to respond.</em></p>
      `,
    });

    res.status(200).json({ message: 'Ticket submitted successfully' });
  } catch (err) {
    console.error('Error submitting ticket:', err);
    res.status(500).json({ error: 'Failed to submit ticket' });
  }
};

// ✅ Admin responds to applicant ticket
export const respondToTicket = async (req, res) => {
  const { id } = req.params;
  const { response } = req.body;

  try {
    if (!response) return res.status(400).json({ error: 'Response message is required.' });

    const ticket = await Ticket.findById(id);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

    ticket.adminResponse = response;
    ticket.status = 'closed';
    await ticket.save();

    await transporter.sendMail({
      from: `"Support Team" <${process.env.EMAIL_USER}>`,
      to: ticket.applicantEmail,
      subject: `Response to Your Support Ticket: ${ticket.subject}`,
      html: `
        <p>Dear User,</p>
        <p>We have responded to your support request regarding: <strong>${ticket.subject}</strong>.</p>
        <p><strong>Response:</strong></p>
        <p>${response}</p>
        <p>Thank you for reaching out.</p>
      `,
    });

    res.status(200).json({ message: 'Response sent and ticket closed' });
  } catch (err) {
    console.error('Error responding to ticket:', err);
    res.status(500).json({ error: 'Failed to respond to ticket' });
  }
};

// ✅ NEW: Unauthenticated ticket from public landing page
export const submitPublicTicket = async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    // Optional: Save to DB (uncomment if needed)
    // const ticket = new Ticket({ name, applicantEmail: email, subject, message, isPublic: true });
    // await ticket.save();

    await transporter.sendMail({
      from: `"Landing Page Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_SUPPORT_EMAIL,
      subject: `Public Contact: ${subject}`,
      html: `
        <h2>Contact Request from Landing Page</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    res.status(200).json({ message: 'Support request sent successfully.' });
  } catch (err) {
    console.error('Error submitting public ticket:', err);
    res.status(500).json({ error: 'Failed to send support request.' });
  }
};
