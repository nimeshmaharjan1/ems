import { formatPrice } from "@/shared/utils/helper.util";
import {
  Body,
  Column,
  Container,
  Head,
  Html,
  Img,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

export const OrderConfirmationEmail = (order: any) => {
  return (
    <Tailwind>
      <Html>
        <Head />
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-gray-300 rounded-md my-4 mx-auto p-4 max-w-xs md:max-w-sm">
            <Section className="flex items-center justify-between">
              <Text className="text-black text-[18px] font-semibold text-center mb-4">
                Eeshan Mahadev Enterprises - Order Confirmation
              </Text>
            </Section>
            <Text className="text-black text-[14px] leading-[24px]">
              Hello, {order?.user?.name}
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              This email is to confirm that we have received your order #
              {order.orderNumber} and is being processed.
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              <strong>Order status:</strong> {order.status}
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              <strong>Order number:</strong> #{order.orderNumber}
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              <strong>Name:</strong> {order?.user?.name}
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              <strong>Phone:</strong> {order?.user?.phone_number}
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              <strong>Address:</strong> {order.customerAddress}
            </Text>
            <Text className="text-black text-[14px] leading-[24px] mt-4">
              <strong>Ordered Products:</strong>
            </Text>
            {order.items.map((item: any) => (
              <Row key={item.id} className="mt-4 first:mt-0">
                <Column align="left">
                  <Img
                    src={item?.product?.images?.[0]}
                    width="180"
                    height="145"
                    alt="Product"
                    style={plantImg}
                  />
                </Column>
                <Column>
                  <Text className="font-bold">{item?.product?.title}</Text>
                  <Text>
                    Rs. {item?.product?.price} x {item?.product?.quantity}
                  </Text>
                </Column>
              </Row>
            ))}
            {/* <Text className="text-black text-[14px] leading-[24px] mt-4">
              <strong>Sub-total:</strong> Rs. {subTotal}
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              <strong>Delivery Charge:</strong> Rs. {deliveryCharge}
            </Text> */}
            <Text className="text-black text-[14px] leading-[24px]">
              <strong>Total:</strong> Rs. {formatPrice(order?.totalPrice)}
            </Text>
            <Text className="text-black text-[14px] leading-[24px] mt-4">
              We are working our best to fulfill your order.
            </Text>
            {/* <Text className="text-black text-[14px] leading-[24px] mt-4">
              Order Tracking Link:{" "}
              <Link href={trackingLink} className="text-blue-600 no-underline">
                {trackingLink}
              </Link>
            </Text> */}
            <Text className="text-black text-[14px] leading-[24px] mt-4">
              Customer Support: If you have any questions or need assistance,
              please contact us at +977-9841XXXXXX
            </Text>
            <Text className="text-black text-[14px] leading-[24px] mt-4">
              We appreciate your patience and understanding. Thank you for
              choosing us!
            </Text>
            <Text className="text-black text-[14px] leading-[24px] mt-8">
              Best regards,
              <br />
              Eeshan Mahadev Enterprises
            </Text>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
};

export default OrderConfirmationEmail;

const heroSection = {
  position: "relative" as const,
  width: "100%",
  display: "inline-block",
};

const banner = {
  width: "inherit" as const,
  height: "auto",
};

const plantName = {
  fontWeight: "600",
  fontSize: "1.125rem",
};

const plantImg = {
  borderRadius: "15px",
  objectFit: "cover" as const,
};

// const plantCopy = {
//   color: "#000",
//   padding: "0 0.8rem",
// };
