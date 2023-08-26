import { formatPrice } from "@/shared/utils/helper.util";
import { Body } from "@react-email/body";
import { Column } from "@react-email/column";
import { Container } from "@react-email/container";
import { Head } from "@react-email/head";
import { Html } from "@react-email/html";
import { Img } from "@react-email/img";
import { Row } from "@react-email/row";
import { Section } from "@react-email/section";
import { Tailwind } from "@react-email/tailwind";
import { Text } from "@react-email/text";

export const OrderEmail = (order: any) => {
  return (
    <Tailwind>
      <Html>
        <Head />
        <Body className="bg-white dark:bg-neutral-900 text-black dark:text-white my-auto mx-auto font-sans p-6">
          <Container className="border border-solid border-gray-300 rounded-md mx-auto p-5 pt-8 max-w-xs md:max-w-lg pb-5">
            <Row className="mb-9">
              <Column align="left" className="text-base md:text-lg font-bold">
                Eeshan Mahadev Enterprises
              </Column>

              <Column align="right" className="text-sm">
                26th Aug, 2023
              </Column>
            </Row>
            <Text className="">Hey {order?.user?.name},</Text>
            <Text className="">
              This email is to confirm that we have received your order #
              {order.orderNumber} and is being processed.{" "}
              <strong>Please check the order status below.</strong>
            </Text>
            <Section className="border border-solid border-gray-300 rounded-md p-4">
              <Row className="mb-3">
                <Column>
                  <strong>Order status</strong>
                </Column>
                <Column
                  align="right"
                  className="text-green-600 dark:text-green-500"
                >
                  {order.status}
                </Column>
              </Row>{" "}
              <Row className="mb-3">
                <Column>
                  <strong>Order number</strong>
                </Column>
                <Column align="right">#{order.orderNumber}</Column>
              </Row>{" "}
              <Row className="mb-3">
                <Column>
                  <strong>Name</strong>
                </Column>
                <Column align="right">{order?.user?.name}</Column>
              </Row>{" "}
              <Row className="mb-3">
                <Column>
                  <strong>Email</strong>
                </Column>
                <Column align="right">{order?.user?.email}</Column>
              </Row>{" "}
              <Row className="mb-3">
                <Column>
                  <strong>Phone Number</strong>
                </Column>
                <Column align="right">{order?.user?.phone_number}</Column>
              </Row>{" "}
              <Row className="mb-3">
                <Column>
                  <strong>Address</strong>
                </Column>
                <Column align="right">{order?.customerAddress}</Column>
              </Row>
            </Section>
            <Text className="mt-8 text-lg">
              <strong>Ordered Products</strong>
            </Text>
            {order.items.map((item: any) => (
              <Row key={item.id} className="mt-4 first:mt-0">
                <Column align="left" className="w-48">
                  <Img
                    src={item?.product?.images?.[0]}
                    width="160"
                    height="125"
                    alt="Product"
                    className="object-cover rounded-md"
                  />
                </Column>
                <Column align="left">
                  <Text className="font-bold">{item?.product?.title}</Text>
                  <Text>
                    Rs. {formatPrice(item?.price)} x {item?.quantity}
                  </Text>
                </Column>
              </Row>
            ))}
            {/* <Text className=" mt-4">
                <strong>Sub-total</strong> Rs. {subTotal}
              </Text>
              <Text className="">
                <strong>Delivery Charge</strong> Rs. {deliveryCharge}
              </Text> */}
            <Section className="border border-solid border-gray-300 px-4 pt-3 rounded-md my-8">
              <Row className="mb-3">
                <Column>
                  <strong>Delivery Charge</strong>
                </Column>
                <Column align="right">
                  Rs. {formatPrice(order?.deliveryCharge)}
                </Column>
              </Row>
              <Row className="mb-3">
                <Column>
                  <strong>Total</strong>
                </Column>
                <Column
                  align="right"
                  className="text-green-600 dark:text-green-500"
                >
                  <strong>Rs. {formatPrice(order?.totalPrice)}</strong>
                </Column>
              </Row>
            </Section>
            <Text className=" mt-4">
              We are working our best to fulfill your order.
            </Text>
            {/* <Text className=" mt-4">
                Order Tracking Link:{" "}
                <Link href={trackingLink} className="text-blue-600 no-underline">
                  {trackingLink}
                </Link>
              </Text> */}
            <Text className=" mt-4">
              Customer Support: If you have any questions or need assistance,
              please contact us at +977-9841XXXXXX
            </Text>
            <Text className=" mt-4">
              We appreciate your patience and understanding. Thank you for
              choosing us!
            </Text>
            <Text className=" mt-8 mb-0">
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
