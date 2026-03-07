import nodemailer from "nodemailer";
import HttpError from "./HttpError.js";

const mail_config = {
  host: process.env.mail_host,
  port: Number(process.env.mail_port),
  secure: true,
  auth: {
    user: process.env.mail_user,
    pass: process.env.mail_password,
  },
};

const transporter = nodemailer.createTransport(mail_config);

export async function sendMail(message) {
  try {
    await transporter.sendMail(message);
  } catch (error) {
    console.log("mail error: ", error);
    throw HttpError(500);
  }
}

export async function sendVerificationEmail(email, url) {
  const message = {
    to: email,
    from: process.env.verifyMailFrom,
    subject: "Verify Email",
    text: `visit link to verify email ${url}`,
    html: `<a href="${url}">visit link to verify email</a>`,
  };

  try {
    await sendMail(message);
  } catch (error) {
    console.log(error);
    throw HttpError(500);
  }
}
