const {PrismaClient}  = require('@prisma/client');
const prisma = new PrismaClient();

async function checkToken(req, res,next){
    try{
        if(!req.headers.authorization){
            res.status(401).send('Unauthorized');
            return;
        }

        const user = await prisma.User.findFirst({
            where:{
                token: req.headers.authorization.split(" ")[1]
            }
        });

        if(!user){
            res.status(401).send('Unauthorized');
            return;
        }

        next();

    }catch(e){
        console.log(e);
    }
}

module.exports = checkToken;