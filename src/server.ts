import express, { Request, Response } from "express";
import { MongoClient } from "mongodb";
import { Resend } from 'resend';
import { render } from "@react-email/render";
import cors from "cors";
// import { SubscriberEmail } from "./emails/SubscriberEmail";
// import { AdminEmail } from "./emails/AdminEmail";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const resend = new Resend(process.env.RESEND_API_KEY);
const mongoUri = process.env.MONGO_URI as string;
const client = new MongoClient(mongoUri);

app.use(cors());
app.use(express.json());

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  location?: string;
  interests: string[];
}

app.post("/api/subscribe", async (req: Request, res: Response) => {
  const formData: FormData = req.body;

  if (!formData.email || !formData.firstName || !formData.lastName) {
    return res.status(400).json({ error: "Required fields missing" });
  }

  try {
    await client.connect();
    const db = client.db("newsletter");
    const subscribers = db.collection("subscribers");
    await subscribers.insertOne({ ...formData, subscribedAt: new Date() });

    // const subscriberHtml = render(SubscriberEmail({ firstName: formData.firstName, email: formData.email }));
    // const adminHtml = render(AdminEmail({ formData }));

    await resend.emails.send({
      from: "markyokuhaire18@gmail.com",
      to: "markyokuhaire18@gmail.com",
      subject: "New Newsletter Subscription",
      html:  '<p>it works!</p>',
    });
    await resend.emails.send({
      from: "markyokuhaire18@gmail.com",
      to: formData.email,
      subject: "Thanks for Subscribing!",
      html:  '<p>it works!</p>',
    });

    res.status(200).json({ message: "Subscription successful" });
  } catch (error) {
    res.status(500).json({ error: "Failed to process subscription" });
  } finally {
    await client.close();
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});