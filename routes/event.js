const express = require('express');
const router = express.Router();

const checkToken = require('../middlewares/CheckToken');
const EventController = require('../controllers/EventController');

router.use(checkToken);
router.post('/events/create'  , EventController.create);
router.get('/events/list'  , EventController.index);
router.get('/venues'  , EventController.getVenue);
router.put('/events/edit/:id'  , EventController.update);


module.exports = router;