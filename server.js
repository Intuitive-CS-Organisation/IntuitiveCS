import dotenv from "dotenv";
dotenv.config();
import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors()); // Allow frontend to make requests

// Email sending route
app.post("/send-email", async (req, res) => {
    const { message, email } = req.body;

    if (!message) {
        return res.status(400).json({ status: "Error: Message is required" });
    }

    // Email configuration
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: "shajan@intuitive.ca",
        subject: "New Contact Form Submission",
        text: `Message: ${message}\nFrom: ${email || "Anonymous User"}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ status: "Message sent successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: `Error: ${error.message}` });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
