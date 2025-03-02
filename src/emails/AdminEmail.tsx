import { Html, Container, Text } from "@react-email/components";

interface AdminEmailProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    location?: string;
    interests: string[];
  };
}

export const AdminEmail = ({ formData }: AdminEmailProps) => (
  <Html>
    <Container>
      <Text style={{ fontSize: "16px", color: "#333" }}>
        New Newsletter Subscription
      </Text>
      <Text>Name: {formData.firstName} {formData.lastName}</Text>
      <Text>Email: {formData.email}</Text>
      <Text>Location: {formData.location || "Not provided"}</Text>
      <Text>Interests: {formData.interests.join(", ") || "None selected"}</Text>
    </Container>
  </Html>
);