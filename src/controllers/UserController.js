const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
const bcrypt = require('bcrypt');
BigInt.prototype.toJSON = function () { return this.toString() }


const setNewPassword = async (id, user_password) => {
    const password = await bcrypt.hash(user_password, 8);
    console.log(password);
    try {
        result = await prisma.usuario.update({
            where: {
                id: parseInt(id)
            },
            data: {
                password: password
            }
        });
        return await result.id;
    } catch (error) {
        console.log(error);
    }
}

module.exports = { setNewPassword }