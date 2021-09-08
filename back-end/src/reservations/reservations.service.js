const knex = require("../db/connection");

function list(query) {
    if (query.date) {
        return knex("reservations")
            .select("*")
            .where({"reservation_date": query.date})
            .whereNot({"status": "finished"})
            .orderBy("first_name");
    } else if(query.mobile_number) {
        return knex("reservations")
            .whereRaw(
                "translate(mobile_number, '() -', '') like ?",
                `%${query.mobile_number.replace(/\D/g, "")}%`
            )
            .orderBy("reservation_date");
    } else {
        return knex("reservations")
            .select("*")
            .orderBy("first_name");
    }
}

function read(reservationId) {
    return knex("reservations")
        .select("*")
        .where({"reservation_id": reservationId})
        .first()
}

function create(newReservation) {
    return knex("reservations")
        .insert(newReservation)
        .returning("*");
}

function update(newReservation) {
    return knex("reservations")
        .where({"reservation_id": newReservation.reservation_id})
        .update(newReservation, "*")
        .returning("*")
}

module.exports = {
    list,
    read,
    create,
    update,
}