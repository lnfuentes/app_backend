const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: 'fuentes.n.leandro@gmail.com', 
      pass: 'haokzblldodqnwdg',
    },
});

transporter.verify().then(() => {
    console.log('ready for send emails');
})

module.exports = transporter;