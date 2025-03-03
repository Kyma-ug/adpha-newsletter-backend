import express, { Request, Response } from "express";
import { MongoClient, Db } from "mongodb";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = "mongodb+srv://newsletterUser:D*AAt%40vxjnJ5%40Zv@adpha0.di3np.mongodb.net/newsletter?retryWrites=true&w=majority&appName=Adpha0";

const client = new MongoClient(mongoUri, {
  connectTimeoutMS: 10000,
  serverSelectionTimeoutMS: 10000,
});

let db: Db;

async function connectToMongo() {
  try {
    await client.connect();
    db = client.db("newsletter");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

connectToMongo();

app.use(cors());
app.use(express.json());

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  location: string;
  interests: string[];
}

// POST: Add a new subscriber
app.post("/api/subscribe", async (req: Request, res: Response) => {
  const formData: FormData = req.body;

  if (!formData.email || !formData.firstName || !formData.lastName) {
    return res.status(400).json({ error: "Required fields missing" });
  }

  try {
    const subscribers = db.collection("subscribers");
    const result = await subscribers.insertOne({ ...formData, subscribedAt: new Date() });
    
    res.status(200).json({ 
      message: "Subscription successful",
      insertedId: result.insertedId
    });
  } catch (error) {
    console.error("Error inserting into MongoDB:", error);
    res.status(500).json({ error: "Failed to process subscription" });
  }
});

// GET: Retrieve all subscribers
app.get("/api/subscribers", async (req: Request, res: Response) => {
  try {
    const subscribers = db.collection("subscribers");
    const subscriberList = await subscribers.find({}).toArray();
    
    res.status(200).json({
      message: "Subscribers retrieved successfully",
      data: subscriberList
    });
  } catch (error) {
    console.error("Error retrieving subscribers:", error);
    res.status(500).json({ error: "Failed to retrieve subscribers" });
  }
});

process.on("SIGTERM", async () => {
  await client.close();
  console.log("MongoDB connection closed");
  process.exit(0);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});