const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail', // Cambia al proveedor que uses (Gmail, Outlook, etc.)
    auth: {
        user: process.env.EMAIL_USER, // Configura tu correo en .env
        pass: process.env.EMAIL_PASS,
    },
});

const sendEmailNotification = async (email, symbol, currentPrice) => {
    const mailOptions = {
        from: 'cryptoalerts@yourapp.com',
        to: email,
        subject: `🔔 Alerta cumplida para ${symbol}`,
        text: `La criptomoneda ${symbol} ha alcanzado el precio de ${currentPrice} USD.`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Correo enviado a ${email}`);
    } catch (error) {
        console.error('Error al enviar el correo:', error);
    }
};

module.exports = sendEmailNotification;
