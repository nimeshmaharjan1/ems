import { Body, Button, Container, Head, Hr, Html, Img, Preview, Section, Text } from '@react-email/components';
import * as React from 'react';

interface KoalaWelcomeEmailProps {
  userFirstname: string | null;
}

// const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '';

export const WelcomeEmail = ({ userFirstname = 'Zeno' }: KoalaWelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to Eeshan Mahadev Enterprises</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* <Img src={`${baseUrl}/static/koala-logo.png`} width="170" height="50" alt="Koala" style={logo} /> */}
        <Text style={paragraph}>Hi {userFirstname},</Text>
        <Text style={paragraph}>
          Welcome to Eeshan Mahadev Enterprises! We are thrilled to have you join our community of savvy shoppers. Thank you for choosing us
          for your online shopping needs. Dive into our vast collection of products, from kitchen appliances to other needy household
          appliances. We&apos;re sure you&apos;ll find something you love.
        </Text>
        <Section style={btnContainer}>
          <Button pX={12} pY={12} style={button} href="https://www.eeshanmahadev.com.np/products">
            Get started
          </Button>
        </Section>
        <Text style={paragraph}>
          Best,
          <br />
          Eeshan Mahadev Enterprises
        </Text>
        <Hr style={hr} />
        <Text style={footer}>New Road, Kathmandu</Text>
      </Container>
    </Body>
  </Html>
);

export default WelcomeEmail;

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
};

const logo = {
  margin: '0 auto',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
};

const btnContainer = {
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#5F51E8',
  borderRadius: '3px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
};

const hr = {
  borderColor: '#cccccc',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
};
