import nodeMailer from "nodemailer";

const sendEmail = async (email , title , body) => {
  const transporter = nodeMailer.createTransport({
    host: process.env.SMPT_HOST,
    port: process.env.SMTP_PORT,
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASSWORD,
    },
  });

  const mailOptions = {
    from: 'IEI Student Chapter',
    to: `${email}`,
    subject: `${title}`,
    html: `${body}`,
  };
  await transporter.sendMail(mailOptions);

};

export { sendEmail }
