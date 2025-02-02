const router = require('express').Router();
const { Reservation, Location, Room, User } = require('../../models');
const { withAuth } = require('../../utils/auth');

// The `/api/reservations` endpoint

// get all reservations
router.get('/', async (req, res) => {
  // find all reservations
  // be sure to include its associated Category and Tag data
  try {
    const reservationData = await Reservation.findAll({
      include: [{ model: Room, include: [{ model: Location }] }]
    });
    res.status(200).json(reservationData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// get one reservation
router.get('/:id', async (req, res) => {
  // find a single reservation by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const reservationData = await Reservation.findByPk(req.params.id, {
      include: [{ model: Location }, { model: Room }]
    });

    if (!reservationData) {
      res.status(404).json({ message: 'That reservation does not exist!' });
      return;
    }

    res.status(200).json(reservationData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get all the reservations for the room passed in
router.get('/room/:roomId', async (req, res) => {
  // find a single reservation by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const reservationData = await Reservation.findAll({
      where: {
        roomId: req.params.roomId,
      },
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    if (!reservationData) {
      res.status(404).json({ message: 'No reservations found for this room!' });
      return;
    }

    res.status(200).json(reservationData);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// create new reservation
router.post('/', withAuth, async (req, res) => {
  try {
    let reservation = {...req.body};
    //TODO: Change this to use a status ENUM
    reservation.status = 'Pending Approval';

    //Get the room record
    const roomData = await Room.findByPk(req.body.roomId, {
      include: [{ model: Location }]
    });

    if (!roomData) {
      res.status(404).json({ message: 'That room does not exists!' });
      return;
    }

    let room = roomData.get({ plain: true });

    console.log('room is ', room);
    reservation.managedBy = room.location.managedBy;

    const reservationData = await Reservation.create({
      ...reservation,
      userId: req.session.user_id
    });

    // if no reservation tags, just respond
    res.status(200).json(reservationData);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// update reservation
router.put('/:id', withAuth, async (req, res) => {
  try {
    // update reservation data
    const reservationData = await Reservation.update(req.body, {
      where: {
        id: req.params.id
      }
    });

    if (!reservationData) {
      res.status(404).json({ message: 'That reservation does not exist!' });
      return;
    }

    res.status(200).json(reservationData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', withAuth, async (req, res) => {
  // delete one reservation by its `id` value
  try {
    const reservationData = await Reservation.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id
      }
    });

    if (!reservationData) {
      res.status(404).json({ message: 'That reservation does not exist!' });
      return;
    }

    res.status(200).json(reservationData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
