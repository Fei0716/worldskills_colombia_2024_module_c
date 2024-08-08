const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

async function create(req,res,next){
    try{
        const {fullname, email, phone, event_id} = req.body;
        if(!fullname || !email || !phone || !event_id){
            res.status(400).send('Request error.');
            return;
        }

        const participant = await prisma.Participant.create({
            data:{
                fullname: fullname,
                email: email,
                phone: phone,
                event_id: event_id,
            }
        });

        res.status(200).send("Successful participant registration.");
    }catch (e) {
        console.log(e);
    }
}


async function index(req,res,next){
    try{
        const eventId = req.params.id;
        if(!eventId){
            res.status(400).send('Request error.');
            return;
        }
        const event = await prisma.Event.findFirst({
            where:{
                id: parseInt(eventId)
            }
        });

        if(!event){
            res.status(404).send('Resource not found.');
            return;
        }
        const participants = await prisma.Participant.findMany({
            where:{
                event_id: event.id
            },
            include:{
                event: true,
            },
            orderBy:{
                fullname: 'asc',
            }
        });

        res.status(200).json({
            "participants": participants,
            "message": "Successful query.",
        });
    }catch (e) {
        console.log(e);
    }
}

async function destroy(req,res,next){
    try{
        const id = req.params.id;
        if(!id){
            res.status(400).send('Request error.');
            return;
        }
        const participant = await prisma.Participant.findFirst({
            where:{
                id: parseInt(id)
            }
        });

        if(!participant){
            res.status(404).send('Participant not found.');
            return;
        }
        await prisma.Participant.delete({
            where:{
                id: participant.id
            }
        });

        res.status(204).send("Successful deletion")
    }catch (e) {
        console.log(e);
    }
}

module.exports = {
    create,
    index,
    destroy,
};