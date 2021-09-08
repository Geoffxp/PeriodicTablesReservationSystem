const asyncErrorBoundary = require("../errors/asyncErrorBoundary")
const service = require("./tables.service")
const reservationsService = require("../reservations/reservations.service")

/* BEGIN VALIDATION */

/* CREATE VALIDATION */

function validateCreate(req, res, next) {
    if (!req.body.data) {
        return next({
            status: 400,
            message: "Must include a valid body to create a new table"
        })
    }
    const { table_name, capacity } = req.body.data;

    if (!table_name || table_name.length <= 1) {
        return next({
            status: 400,
            message: "table_name must be included and must be at least 2 characters long"
        })
    }

    if (!capacity || typeof capacity === "string" || capacity < 1) {
        return next ({
            status: 400,
            message: "capacity must be a number greater than 0"
        })
    }
    return next();
}

/* SEATING VALIDATION */

async function validateUpdate(req, res, next) {
    if (!req.body.data) {
        return next({
            status: 400,
            message: "Update must include a valid body"
        })
    }
    const { reservation_id } = req.body.data
    if (!reservation_id || isNaN(Number(reservation_id))) {
        return next({
            status: 400,
            message: "A numerical reservation_id must be included in the body of the request"
        })
    }
    const reservation = await reservationsService.read(Number(reservation_id));
    if (!reservation) {
        return next({
            status: 404,
            message: `Reservation with id ${reservation_id} was not found`
        })
    }
    if (reservation.status === "seated") {
        return next({
            status: 400,
            message: "The reservation has already been seated"
        })
    }
    const { table_id } = req.params;
    const table = await service.read(table_id);
    if (!table) {
        return next({
            status: 404,
            message: `Table with id ${table_id} not found`
        })
    }
    if (table.capacity < reservation.people) {
        return next({
            status: 400,
            message: "Table capacity is too low for the reservation size"
        })
    }
    if (table.reservation_id !== null) {
        return next({
            status: 400,
            message: "The table is already occupied"
        })
    }
    return next();
}

/* FINISH BUTTON VALIDATION */

async function validateFinish(req, res, next) {
    const { table_id } = req.params;
    const table = await service.read(table_id);
    if (!table) {
        return next({
            status: 404,
            message: `Table with id ${table_id} not found`
        })
    }
    if (table.reservation_id === null) {
        return next({
            status: 400,
            message: "The table is not occupied"
        })
    }
    return next()
}

/* BEGIN CRUD */

async function create(req, res) {
    const newTable = await service.create(req.body.data);
    return res.status(201).json({ data: newTable[0] })
}

async function list(req, res) {
    const tables = await service.list();
    return res.status(200).json({ data: tables })
}

/* SEATING RESERVATION */
async function update(req, res) {
    const tableId = req.params.table_id;
    const reservation_id = req.body.data.reservation_id;
    const newTable = {
        ...req.body.data,
        table_id: tableId
    }
    // UPDATES TABLE AND RESERVATION THROUGH KNEX TRANSACTION
    const data = await service.update(newTable, reservation_id);
    return res.status(200).json({ data })
}

/* FINISHING RESERVATION */
async function finishTable(req, res) {
    const tableId = req.params.table_id;
    await service.finishTable(tableId)
    return res.sendStatus(200)
}


module.exports = {
    update: [asyncErrorBoundary(validateUpdate), asyncErrorBoundary(update)],
    list: asyncErrorBoundary(list),
    create: [validateCreate, asyncErrorBoundary(create)],
    finishTable: [asyncErrorBoundary(validateFinish), asyncErrorBoundary(finishTable)]
}