import nodemailer from 'nodemailer'
const { MAIL_PASSWORD, MAIL_FROM } = process.env


const nodemailerConfig = {

host: "smtp.ukr.net",
port: 465, 
secure: true,
  auth: {
    user: MAIL_FROM,
    pass: MAIL_PASSWORD,

  },
}


const transport = nodemailer.createTransport(nodemailerConfig)

const SendEmail = (data) => {
  const email = { ...data, from: MAIL_FROM }
  return transport.sendMail(email)
}

export default SendEmail
