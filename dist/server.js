"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("mongodb");
const resend_1 = require("resend");
const cors_1 = __importDefault(require("cors"));
// import { SubscriberEmail } from "./emails/SubscriberEmail";
// import { AdminEmail } from "./emails/AdminEmail";
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
const mongoUri = process.env.MONGO_URI;
const client = new mongodb_1.MongoClient(mongoUri);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post("/api/subscribe", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const formData = req.body;
    if (!formData.email || !formData.firstName || !formData.lastName) {
        return res.status(400).json({ error: "Required fields missing" });
    }
    try {
        yield client.connect();
        const db = client.db("newsletter");
        const subscribers = db.collection("subscribers");
        yield subscribers.insertOne(Object.assign(Object.assign({}, formData), { subscribedAt: new Date() }));
        // const subscriberHtml = render(SubscriberEmail({ firstName: formData.firstName, email: formData.email }));
        // const adminHtml = render(AdminEmail({ formData }));
        yield resend.emails.send({
            from: "markyokuhaire18@gmail.com",
            to: "markyokuhaire18@gmail.com",
            subject: "New Newsletter Subscription",
            html: '<p>it works!</p>',
        });
        yield resend.emails.send({
            from: "markyokuhaire18@gmail.com",
            to: formData.email,
            subject: "Thanks for Subscribing!",
            html: '<p>it works!</p>',
        });
        res.status(200).json({ message: "Subscription successful" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to process subscription" });
    }
    finally {
        yield client.close();
    }
}));
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
