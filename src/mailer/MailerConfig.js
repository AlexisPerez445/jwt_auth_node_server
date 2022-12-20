 const nodemailer = require('nodemailer');

 /*
 MAILTRAP
 perezalexis1994@gmail.com
 Daw2022@
 */
const createTrans = () => {
  const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "d106616fdcf510",
      pass: "a7a94325b53614"
    }
  });
  return transport
}


const sendEmail =  async (nombre, email, token) => {
  const transporter = createTrans();
  const info =await transporter.sendMail({
    from: '"Fred Foo 👻" <alex_daw@email.com>',
    to: `${email}`, 
    subject: "RESET PASSWORD", 
    html: `<b>Hola, ${nombre}, <br>
    Puedes crear una nueva contraseña en el siguiente enlace: <br>
    http://localhost:4200/reset-password/${token}
    </b>`,
  });
  console.log('mensaje enviado');
} 

 exports.sendMail = (nombre,email, token) => sendEmail(nombre, email, token);