const asyncErrorBoundary = require("../errors/asyncErrorBoundary")
const service = require("./reservations.service")

/* BEGIN VALIDATION */

async function reservationExists(req, res, next) {
  const reservationId = Number(req.params.reservation_id);
  const reservation = await service.read(reservationId);
  
  if (!reservation) {
    return next({
      status: 404,
      message: `Reservation with id ${reservationId} not found`
    })
  }
  res.locals.reservation = reservation;
  return next();
}

/* CREATE VALIDATION - BODY, DATES / TIMES, PATTERNS */

function validateBody(req, res, next) {
  if (!req.body.data) {
    return next({
      status: 400,
      message: "body must include data property"
    })
  }

  const {
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
    status
  } = req.body.data;

  if (status && status !== "booked") {
    return next({
      status: 400,
      message: "Status cannot be set to 'seated' or 'finished' upon reservation creation"
    })
  }
  if (first_name && last_name && mobile_number && reservation_date && reservation_time && people) {
    return next()
  } else {
    return next({
      status: 400,
      message: "Reservation is missing information. Reservations must include first_name, last_name, mobile_number, reservation_date, reservation_time, and people"
    })
  }
}

const dateCheck = (req, res, next) => {
  const { reservation_date, reservation_time } = req.body.data
  const todaysDate = new Date()
  const dateToCheck = new Date(`${reservation_date}, ${reservation_time}`)
  const day = dateToCheck.getDay();
  const hour = dateToCheck.getHours();
  const minutes = dateToCheck.getMinutes();

  if (todaysDate > dateToCheck) {
    return next({
      status: 400,
      message: "Reservation must be set at a future date"
    })
  }
  if (day === 2) {
    return next({
      status: 400,
      message: "We are closed on tuesdays!"
    })
  }
  if (hour < 10 || hour > 21 || (hour === 10 && minutes < 30) || (hour === 21 && minutes > 30)) {
    return next({
      status: 400,
      message: "Reservation must be between 10:30 AM and 9:30 PM"
    })
}
  return next();
}

function validatePatterns(req, res, next) {
  const reDate = /\d{4}([-\/\.])\d{2}\1\d{2}/
  const reTime = /\d{2}([:])\d{2}/
  const {
    reservation_date,
    reservation_time,
    people,
  } = req.body.data;
  if (!reDate.test(reservation_date)) {
    return next({
      status: 400,
      message: "reservation_date is formatted incorrectly"
    })
  }
  if (!reTime.test(reservation_time)) {
    return next({
      status: 400,
      message: "reservation_time is formatted incorrectly"
    })
  }
  if(typeof people === "string" || isNaN(people)) {
    return next({
      status: 400,
      message: "Number of people must be an integer"
    })
  }
  return next();
}

/* UPDATE VALIDATION */

function validateUpdate(req, res, next) {
  const reDate = /\d{4}([-\/\.])\d{2}\1\d{2}/
  const reTime = /\d{2}([:])\d{2}/
  const validStatus = ["booked", "seated", "finished", "cancelled"];
  const { reservation } = res.locals;
  if (reservation.status === "finished") {
    return next({
      status: 400,
      message: "finished reservations cannot be updated"
    })
  }

  const {
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
    status
  } = req.body.data

  if (status === "cancelled") {
    return next()
  }

  if (!first_name || (first_name && !first_name.length) ||
    !last_name || (last_name && !last_name.length) ||
    !mobile_number || (mobile_number && !mobile_number.length) ||
    !people || (people && people < 1)) {
    return next({
      status: 400,
      message: "Reservation is missing information. Reservations must include first_name, last_name, mobile_number, reservation_date, reservation_time, and people"
    })
  }
  if (!reDate.test(reservation_date)) {
    return next({
      status: 400,
      message: "reservation_date is formatted incorrectly"
    })
  }
  if (!reTime.test(reservation_time)) {
    return next({
      status: 400,
      message: "reservation_time is formatted incorrectly"
    })
  }
  if(typeof people === "string" || isNaN(people)) {
    return next({
      status: 400,
      message: "Number of people must be an integer"
    })
  }
  if (status && !validStatus.includes(status)) {
    return next({
      status: 400,
      message: "status is unknown, status must be 'booked', 'seated', 'finished', or cancelled"
    })
  }
  return next();
}

/* FOR PATH="/reservations/:reservation_id/status" */

async function statusCheckOnly(req, res, next) {
  const reservation = res.locals.reservation;
  const status = req.body.data.status;
  if (reservation.status === "finished") {
    return next({
      status: 400,
      message: "finished reservations cannot be updated"
    })
  }
  const validStatus = ["booked", "seated", "finished", "cancelled"];
  if (!validStatus.includes(status)) {
    return next({
      status: 400,
      message: "status is unknown, status must be 'booked', 'seated', 'finished', or cancelled"
    })
  }
  return next();
}

/* BEGIN CRUD */

async function list(req, res) {
  const query = req.query
  const reservations = await service.list(query);
  return res.status(200).json({ data: reservations });
}

function read(req, res) {
  const reservation = res.locals.reservation;
  return res.status(200).json({ data: reservation })
}

async function create(req, res) {
  const newReservation = await service.create(req.body.data);
  return res.status(201).json({ data: newReservation[0] })
}


async function update(req, res) {
  const { reservation } = res.locals
  const newReservation = {
    ...reservation,
    ...req.body.data
  }
  const response = await service.update(newReservation);
  return res.status(200).json({ data: response[0] });
}

module.exports = {
  updateStatus: [asyncErrorBoundary(reservationExists), statusCheckOnly, asyncErrorBoundary(update)],
  update: [asyncErrorBoundary(reservationExists), validateUpdate, asyncErrorBoundary(update)],
  create: [validateBody, validatePatterns, dateCheck, asyncErrorBoundary(create)],
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(reservationExists), read]

};
