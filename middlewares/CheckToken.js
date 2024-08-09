const {PrismaClient}  = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
async function checkToken(req, res,next){
    try{
        if(!req.headers.authorization){
            res.status(401).send('Unauthorized');
            return;
        }
        //if using md5 or sha256 not JWT
        // const user = await prisma.User.findFirst({
        //     where:{
        //         token: req.headers.authorization.split(" ")[1]
        //     }
        // });
        //
        // if(!user){
        //     res.status(401).send('Unauthorized');
        //     return;
        // }
        jwt.verify( req.headers.authorization.split(" ")[1], process.env.SECRET_KEY , (err, decoded)=>{
            if(err){
                return res.status(401).send(err.message);
            }
            console.log(decoded);
            next();
        });
    }catch(e){
        console.log(e);
    }
}

module.exports = checkToken;