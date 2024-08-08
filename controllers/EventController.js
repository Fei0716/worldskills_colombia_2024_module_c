const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

async function create(req,res,next){
    try{
        const {name, date, venue_id} = req.body;
        if(!name || !date || !venue_id){
            res.status(400).send('Request error.');
            return;
        }



        const event = await prisma.Event.create({
            data:{
                name: name,
                date: new Date(date),
                venue_id: venue_id,
            }
        });

        res.status(201).send('Successful event registration.');
    }catch (e) {
        console.log(e);
    }
}

async function getVenue(req ,res, next){
    try{
        const v = await prisma.Venue.findMany();

        return res.status(200).json({
            "venues": v,
        })
    }catch(e){
        console.log(e);
    }
}
async function index(req,res,next){
    try{
        const events = await prisma.Event.findMany({
            include:{
                venue: true,
            }
        });

        if(!events){
            res.status(404).send('Resource not found');
            return;
        }

        res.status(200).json({
            events: events,
            message: 'Successful query.',
        });

    }catch (e) {
        console.log(e);
    }
}

async function update(req,res,next){
    try{
        const eventId = req.params.id;
        const event  = await prisma.Event.findFirst({
            where:{
                id: parseInt(eventId)
            },
        });
        if(!event){
            res.status(404).send('Event not found.');
            return;
        }

        const {date} = req.body;

        if(!date){
            res.status(400).send('Request error.');
            return;
        }

        await prisma.Event.update({
            data:{
                date: new Date(date),
            },
            where:{
                id: event.id,
            }
        });


        res.status(200).send("Successful edit.");
    }catch (e) {
        console.log(e);
    }
}

module.exports = {
    create,
    index,
    update,
    getVenue
};