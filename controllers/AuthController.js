const {PrismaClient} = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

async function login(req, res , next){
    try{
        const {username, password } = req.body;
        if(!username || !password){
            res.status(401).send('Authentication failed.');
            return;
        }

        const user = await prisma.User.findFirst({
            where:{
                username: username
            }
        });
        if(!user){
            res.status(401).send('Authentication failed.');
            return;
        }
        //create a token
        const token = crypto.createHash('md5').update(user.username).digest('hex');

        //store the token in database
        await prisma.User.update({
            where:{
                id: user.id
            },
            data:{
                token: token
            }
        });

        res.status(200).json({
            token: token,
            message: "Successful authentication"
        });
    }catch(e){
        console.log(e);
    }
}

async function logout(req,res,status){
    try{
        if(!req.headers.authorization){
            res.status(401).send('Unauthorized.');
            return;
        }
        const user = await prisma.User.findFirst({
            where:{
                token: req.headers.authorization.split(" ")[1],
            }
        });
        if(!user){
            res.status(401).send('Unauthorized');
            return;
        }

        //remove the token
        await prisma.User.update({
            where: {
                id: user.id
            },
            data:{
                token: null
            }
        });
        res.status(200).send("Successful logout");
    }catch(e){
        console.log(e);
    }
}
 module.exports = {
     login,
     logout,
 };