const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../frontend')));

app.post('/send', (req, res) => {
    const { name, email, message } = req.body;

    console.log('Received data:', { name, email, message });

    if (!name || !email || !message) {
        console.log('Validation error: All fields are required');
        return res.status(400).send({ error: 'All fields are required' });
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: process.env.GMAIL_USER,
        subject: 'Contact Form Submission',
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Email error:', error);
            return res.status(500).send({ error: 'Failed to send email' });
        }
        console.log('Email sent: ', info);
        res.send({ message: 'Email sent successfully' });
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
});
