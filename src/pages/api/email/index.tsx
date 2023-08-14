import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { render } from "@react-email/render";
import nodemailer from "nodemailer";
import SpringSalesMail from "@/features/email";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { name, email } = req.body;
      const emailHtml = render(SpringSalesMail({ userName: name }));
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: "Spring flower sales💐 Don't miss out!",
        html: emailHtml,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          return res
            .status(400)
            .json({ message: "Error: Could not send email" });
        }

        console.log("Email sent: " + info.response);
        return res.status(200).json({ message: "Email has been sent." });
      });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({
        message: "Failed to send the email please try again later again.",
      });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
