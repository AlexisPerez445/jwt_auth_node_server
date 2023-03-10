const { PrismaClient } = require('@prisma/client');
const { generateToken } = require('../jwt/JWTUtils')
const {generateTokenResetPassword } = require('../jwt/JWTUtils');
const { setNewPassword } = require('../controllers/UserController');
const bcrypt = require('bcrypt');
const sendMail = require('../mailer/MailerConfig');
const prisma = new PrismaClient()
BigInt.prototype.toJSON = function () { return this.toString() }

const login = async (request, response) => {
    const email = request.body.email;
    console.log(email);
    try {
        const user = await prisma.usuario.findUnique({
            where: {
                email
            },
            select: {
                id: true,
                nombre: true,
                password: true
            },
        });
        const comparePassword = await bcrypt.compare(request.body.password, user.password);

        if (comparePassword) {
            delete user.password;
            const data = {
                ok: true,
                name: user.nombre,
                token: generateToken(user.id, user.nombre)
            }
            response.send( JSON.stringify(data) );
        } else {
            const res = {
                ok: false,
                error: 'Password incorrecto'
            }
            response.send(JSON.stringify(res));
        }

    } catch (error) {
        console.log(error);
        response.send(JSON.stringify("user no encontrado"));
    } 
}

const checkToken = (request, response) => {
    return response.status(200).json({
        ok: true,
        msg: 'Token válido'
    });
}

const forgotPassword = async (request, response) => {
    const email = request.body.email;
    try {
        const result = await prisma.usuario.findUnique({
            where: {
                email
            }
        });
        sendMail.sendMail(result.nombre, result.email, generateTokenResetPassword(result.id) );
        response.send(JSON.stringify("Enviado"));
    } catch (error) {
        response.send(JSON.stringify("user email not found"));
    }
}

const resetPassword = async (request, response) => {
    const id = request.user.id;
    const p1 = request.body.p1;
    const p2 = request.body.p2;
    if(request.body.p1 === request.body.p2){
        const result = await setNewPassword(id, p1 );
        if(result){
            response.send(JSON.stringify("Contraseña cambiada"));
        } else {
            response.send(JSON.stringify("Error a insertar nueva contraseña"));
        }
    } else {
        response.send(JSON.stringify("Las contraseñas no son iguales"));
    }
}

module.exports = { login, checkToken, forgotPassword, resetPassword }