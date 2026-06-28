const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// API Endpoint to send email
app.post('/api/send-email', async (req, res) => {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    // Configure Nodemailer with Gmail SMTP
    // IMPORTANT: For security, use an App Password, not your real Gmail password.
    // See how to get one: https://support.google.com/accounts/answer/185833
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'sgenterprises570@gmail.com',
            pass: process.env.EMAIL_PASSWORD || 'YOUR_GMAIL_APP_PASSWORD' // Replace with your App Password or use a .env file
        }
    });

    const emailSubject = `Sourcing Inquiry from ${name} - SGE Website`;
    
    // HTML Email template
    const emailBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #0d2042; border-bottom: 2px solid #ffb300; padding-bottom: 10px;">New Sourcing Inquiry</h2>
            <p>You have received a new sourcing request from the website:</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                <tr>
                    <td style="padding: 8px; font-weight: bold; width: 120px; border-bottom: 1px solid #f0f0f0;">Name:</td>
                    <td style="padding: 8px; border-bottom: 1px solid #f0f0f0;">${name}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #f0f0f0;">Email:</td>
                    <td style="padding: 8px; border-bottom: 1px solid #f0f0f0;"><a href="mailto:${email}">${email}</a></td>
                </tr>
                <tr>
                    <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #f0f0f0;">Phone:</td>
                    <td style="padding: 8px; border-bottom: 1px solid #f0f0f0;">${phone}</td>
                </tr>
            </table>
            <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #ffb300; border-radius: 4px;">
                <h4 style="margin-top: 0; color: #0d2042;">Message / Requirements:</h4>
                <p style="white-space: pre-wrap; line-height: 1.5; color: #333;">${message}</p>
            </div>
            <footer style="margin-top: 30px; font-size: 12px; color: #777; text-align: center; border-top: 1px solid #e0e0e0; padding-top: 15px;">
                Sent automatically by Shree Gowri Enterprise Website
            </footer>
        </div>
    `;

    const mailOptions = {
        from: `"SGE Website Form" <sgenterprises570@gmail.com>`, // Must be your authenticated email
        to: 'sgenterprises570@gmail.com',                      // Recipient
        replyTo: email,                                         // Reply-To user's email
        subject: emailSubject,
        html: emailBody
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email: ' + error.message });
    }
});

// Serve index.html for all other routes
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(` Shree Gowri Enterprise Local Server is Active!`);
    console.log(` URL: http://localhost:${PORT}`);
    console.log(`==================================================\n`);
});
