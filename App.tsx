require("dotenv").config();
const cron = require("node-cron");
const scrapeIt = require("scrape-it");
const nodemailer = require("nodemailer");

const user = process.env.EMAIL;
const pass = process.env.PW;
const site = process.env.SITE;
const titleSelector = process.env.TITLE_SELECTOR;
const descSelector = process.env.DESC_SELECTOR;
const textToCheck = process.env.TEXT_TO_CHECK;
const fromEmail = process.env.FROM_EMAIL;
const toEmails = process.env.TO_EMAILS;
const subject = process.env.SUBJECT;
const body = process.env.BODY;

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user,
    pass,
  },
});

cron.schedule("*/5 * * * *", () => {
  console.log("running a task every five minutes");
  (async () => {
    await run();
  })();
});

async function run() {
  const { data } = await scrapeIt(site, {
    title: {
      selector: titleSelector,
    },
    desc: {
      selector: descSelector,
    },
  });

  if (data.desc === textToCheck) {
    console.log("not available yet");
    const mailOptions = {
      from: fromEmail,
      to: toEmails,
      subject: subject,
      text: body,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email: ", error);
      } else {
        console.log("Email sent: ", info.response);
      }
    });
  } else {
    const mailOptions = {
      from: fromEmail,
      to: toEmails,
      subject: subject,
      text: body,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email: ", error);
      } else {
        console.log("Email sent: ", info.response);
      }
    });
  }
}
