import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";

interface OrderConfirmationEmailProps {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  orderedProducts: { name: string; price: number; quantity: number }[];
  subTotal: number;
  deliveryCharge: number;
  total: number;
  trackingLink: string;
  customerSupportPhone: string;
}

export const OrderConfirmationEmail = ({
  orderNumber = "1008",
  customerName = "Nimesh Maharjan",
  customerPhone = "9843323200",
  customerAddress = "Imadole, Lalitpur Outside Ring Road",
  orderedProducts = [
    { name: "Third", price: 23232323, quantity: 1 },
    // Add more products as needed
  ],
  subTotal = 23232323,
  deliveryCharge = 0,
  total = 23232323,
  trackingLink = "https://intite.blanxer.com/track/64da61a1ddc34a940daed18b",
  customerSupportPhone = "9843323200",
}: OrderConfirmationEmailProps) => {
  return (
    <Tailwind>
      <Html>
        <Head />
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-gray-300 rounded-md my-4 mx-auto p-4 max-w-xs md:max-w-md lg:max-w-2xl">
            <Text className="text-black text-[18px] font-semibold text-center mb-4">
              Intite - Order Confirmation
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              Hello, {customerName}
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              This email is to confirm that we have received your order #
              {orderNumber} and is being processed.
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              <strong>Order status:</strong> Received
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              <strong>Order number:</strong> #{orderNumber}
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              <strong>Name:</strong> {customerName}
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              <strong>Phone:</strong> {customerPhone}
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              <strong>Address:</strong> {customerAddress}
            </Text>
            <Text className="text-black text-[14px] leading-[24px] mt-4">
              <strong>Ordered Products:</strong>
            </Text>
            {orderedProducts.map((product) => (
              <Text
                key={product.name}
                className="text-black text-[14px] leading-[24px] ml-4"
              >
                {product.name}
                <br />
                Rs. {product.price} x {product.quantity}
              </Text>
            ))}
            <Text className="text-black text-[14px] leading-[24px] mt-4">
              <strong>Sub-total:</strong> Rs. {subTotal}
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              <strong>Delivery Charge:</strong> Rs. {deliveryCharge}
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              <strong>Total:</strong> Rs. {total}
            </Text>
            <Text className="text-black text-[14px] leading-[24px] mt-4">
              We are working our best to fulfill your order.
            </Text>
            <Text className="text-black text-[14px] leading-[24px] mt-4">
              Order Tracking Link:{" "}
              <Link href={trackingLink} className="text-blue-600 no-underline">
                {trackingLink}
              </Link>
            </Text>
            <Text className="text-black text-[14px] leading-[24px] mt-4">
              Customer Support: If you have any questions or need assistance,
              please contact us at {customerSupportPhone}
            </Text>
            <Text className="text-black text-[14px] leading-[24px] mt-4">
              We appreciate your patience and understanding. Thank you for
              choosing us!
            </Text>
            <Text className="text-black text-[14px] leading-[24px] mt-8">
              Best regards,
              <br />
              Intite
            </Text>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
};

export default OrderConfirmationEmail;
