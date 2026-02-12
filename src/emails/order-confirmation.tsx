import {
  Html, Body, Container, Section, Text, Button, Img, Head, Preview, Hr, Row, Column
} from "@react-email/components";
import * as React from "react";

interface Props {
  customerName: string;
  orderNumber: string;
  productName: string;
  amount: string;
  date: string;
}

export default function OrderConfirmationEmail({ 
  customerName, orderNumber, productName, amount, date 
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>Order Confirmation {orderNumber}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo Section (Same as above) */}
          <Section style={logoContainer}>
             <Img src="https://atom.motaiot.com/logos/mota-techlink-logo-v2.webp" width="160" alt="Mota" />
          </Section>

          <Section style={content}>
            <Text style={successBadge}>PAYMENT SUCCESSFUL</Text>
            <Text style={heading}>Thank you for your order!</Text>
            <Text style={paragraph}>Hi {customerName}, we are getting your order ready.</Text>

            <Section style={orderCard}>
              <Row>
                <Column><Text style={label}>Order Number</Text></Column>
                <Column align="right"><Text style={value}>{orderNumber}</Text></Column>
              </Row>
              <Row>
                <Column><Text style={label}>Product</Text></Column>
                <Column align="right"><Text style={value}>{productName}</Text></Column>
              </Row>
              <Row>
                <Column><Text style={label}>Date</Text></Column>
                <Column align="right"><Text style={value}>{date}</Text></Column>
              </Row>
              <Hr style={{borderColor: '#334155', margin: '10px 0'}} />
              <Row>
                <Column><Text style={totalLabel}>Total</Text></Column>
                <Column align="right"><Text style={totalValue}>{amount}</Text></Column>
              </Row>
            </Section>

            <Button style={button} href="https://atom.motaiot.com/dashboard/orders">
              Track Order
            </Button>
          </Section>

          <Hr style={hr} />
          <Text style={footer}>© 2026 MOTA TECHLINK</Text>
        </Container>
      </Body>
    </Html>
  );
}

// ... 复用上面的 Styles (main, container, logoBackground 等) ...
// 新增样式:
const successBadge = {
  backgroundColor: "#16a34a", color: "#fff", padding: "6px 16px", borderRadius: "20px",
  fontSize: "12px", fontWeight: "bold", marginBottom: "16px"
};
const orderCard = { backgroundColor: "#1e293b", padding: "20px", borderRadius: "8px", marginTop: "20px" };
const label = { color: "#94a3b8", fontSize: "14px", margin: "4px 0" };
const value = { color: "#f8fafc", fontSize: "14px", fontWeight: "bold", margin: "4px 0" };
const totalLabel = { color: "#cbd5e1", fontSize: "16px", fontWeight: "bold", margin: "0" };
const totalValue = { color: "#3b82f6", fontSize: "20px", fontWeight: "bold", margin: "0" };
const main = { backgroundColor: "#020617", fontFamily: "sans-serif" };
const container = { margin: "0 auto", padding: "20px 0 48px", maxWidth: "560px" };
const logoContainer = { padding: "20px", textAlign: "center" as const };
const content = { padding: "24px", backgroundColor: "#0f172a", borderRadius: "12px", border: "1px solid #1e293b" };
const heading = { fontSize: "24px", fontWeight: "bold", color: "#f8fafc", margin: "0 0 20px" };
const paragraph = { fontSize: "16px", lineHeight: "26px", color: "#cbd5e1" };
const button = { backgroundColor: "#2563eb", borderRadius: "6px", color: "#fff", fontSize: "16px", fontWeight: "bold", textDecoration: "none", textAlign: "center" as const, padding: "12px 24px" };
const hr = { borderColor: "#334155", margin: "20px 0" };
const footer = { color: "#64748b", fontSize: "12px", textAlign: "center" as const };