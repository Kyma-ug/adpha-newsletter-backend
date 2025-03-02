const express = require("express");
const { MongoClient } = require("mongodb");
const { Resend } = require("resend");
const { render } = require("@react-email/render");
const cors = require("cors");
const SubscriberEmail = require("./emails/SubscriberEmail");
const AdminEmail = require("./emails/AdminEmail");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
const resend = new Resend(process.env.RESEND_API_KEY);
const mongoUri = process.env.MONGO_URI;
const client = new MongoClient(mongoUri);

app.use(cors()); // Allow frontend requests
app.use(express.json());

app.post("/api/subscribe", async (req, res) => {
  const formData = req.body;

  if (!formData.email || !formData.firstName || !formData.lastName) {
    return res.status(400).json({ error: "Required fields missing" });
  }

  try {
    // Connect to MongoDB
    await client.connect();
    const db = client.db("newsletter");
    const subscribers = db.collection("subscribers");
    await subscribers.insertOne({ ...formData, subscribedAt: new Date() });

    // Render email templates
    const subscriberHtml = render(SubscriberEmail({ firstName: formData.firstName, email: formData.email }));
    const adminHtml = render(AdminEmail({ formData }));

    // Send emails
    await resend.emails.send({
      from: "info@adpha-ug.org", // Verify this in Resend
      to: "info@adpha-ug.org",
      subject: "New Newsletter Subscription",
      html: adminHtml,
    });
    await resend.emails.send({
      from: "info@adpha-ug.org",
      to: formData.email,
      subject: "Thanks for Subscribing!",
      html: subscriberHtml,
    });

    res.status(200).json({ message: "Subscription successful" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to process subscription" });
  } finally {
    await client.close();
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});