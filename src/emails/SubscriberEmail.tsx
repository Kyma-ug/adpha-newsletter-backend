import { Html, Container, Text, Button } from "@react-email/components";

interface SubscriberEmailProps {
  firstName: string;
  email: string;
}

export const SubscriberEmail = ({ firstName, email }: SubscriberEmailProps) => (
  <Html>
    <Container>
      <Text style={{ fontSize: "16px", color: "#333" }}>
        Hello {firstName}, thank you for subscribing to our newsletter!
      </Text>
      <Text>We’re excited to keep you updated at {email}.</Text>
      <Button
        href="https://yourwebsite.com"
        style={{ background: "#4CAF50", color: "#fff", padding: "10px 20px" }}
      >
        Visit Our Site
      </Button>
    </Container>
  </Html>
);