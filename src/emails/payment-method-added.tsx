import {
  Html, Body, Container, Section, Text, Button, Img, Head, Preview, Hr
} from "@react-email/components";
import * as React from "react";

interface Props {
  customerName: string;
  last4?: string;
}

export default function PaymentMethodAddedEmail({ customerName, last4 = "••••" }: Props) {
  return (
    <Html>
      <Head />
      <Preview>New payment method added to your Mota Techlink account</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo */}
          <Section style={logoContainer}>
             <Img 
              src="https://atom.motaiot.com/logos/mota-techlink-logo-v2.webp" 
              width="160" 
              alt="Mota Techlink" 
             />
          </Section>

          {/* Content */}
          <Section style={content}>
            <Text style={heading}>Payment Method Added</Text>
            <Text style={paragraph}>Hi {customerName},</Text>
            <Text style={paragraph}>
              You have successfully added a new payment method (ending in {last4}) to your account. This card can now be used for faster checkouts.
            </Text>
            
            <Button style={button} href="https://atom.motaiot.com/dashboard/settings">
              Manage Payment Methods
            </Button>

            <Text style={paragraph}>
              If you did not authorize this action, please contact our support team immediately.
            </Text>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>© 2026 MOTA TECHLINK. All rights reserved.</Text>
        </Container>
      </Body>
    </Html>
  );
}

// Styles (Dark Theme)
const main = {
  backgroundColor: "#020617",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "560px",
};

const logoContainer = {
  padding: "20px",
  textAlign: "center" as const,
};

const content = {
  padding: "24px",
  backgroundColor: "#0f172a",
  borderRadius: "12px",
  border: "1px solid #1e293b",
};

const heading = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#f8fafc",
  margin: "0 0 20px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#cbd5e1",
};

const button = {
  backgroundColor: "#2563eb",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  padding: "12px 24px",
};

const hr = {
  borderColor: "#334155",
  margin: "20px 0",
};

const footer = {
  color: "#64748b",
  fontSize: "12px",
  textAlign: "center" as const,
};