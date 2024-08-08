const express = require('express');
const router = express.Router();

const checkToken = require('../middlewares/CheckToken');
const ParticipantController = require('../controllers/ParticipantController');


router.use(checkToken);
router.post('/participants/create' ,  ParticipantController.create);
router.get('/participants/list/:id' ,  ParticipantController.index);
router.delete('/participants/delete/:id' ,  ParticipantController.destroy);

module.exports = router;