const knex = require("../db/connection");

function list() {
    return knex("tables")
        .select("*")
        .orderBy("table_name");
}

function create(newTable) {
    return knex("tables")
        .insert(newTable)
        .returning("*");
}

function read(tableId) {
    return knex("tables")
        .select("*")
        .where({ "table_id": tableId })
        .first()
}
/*  KNEX TRANSACTION - 
    UPDATING TWO TABLES - 
    IF ONE UPDATE FAILS THEY BOTH FAIL 
    SO DATA IS ALWAYS IN SYNC */

/* SEATING RESERVATION */
function update(newTable, reservation_id) {
    return knex.transaction((trx) => {
        knex("tables")
            .transacting(trx)
            .where({"table_id": newTable.table_id})
            .then(() => {
                return knex("reservations")
                    .where({ "reservation_id": reservation_id })
                    .update({ "status": "seated" })
            })
            .then(() => {
                return trx("tables")
                    .where({ "table_id": newTable.table_id })
                    .update({ "reservation_id": reservation_id })
            })
            .then(trx.commit)
            .catch(trx.rollback)
    })
    .then(() => console.log("transaction successful"))
    .catch(() => console.log("transaction failed"))
}

/* FINISHING RESERVATION */
function finishTable(table_id) {
    return knex.transaction((trx) => {
        knex("tables")
            .transacting(trx)
            .where({"table_id": table_id})
            .then((response) => {
                const reservation_id = response[0].reservation_id
                return knex("reservations")
                    .where({ "reservation_id": reservation_id })
                    .update({ "status": "finished" })
            })
            .then(() => {
                return trx("tables")
                    .where({ "table_id": table_id })
                    .update({ "reservation_id": null })
            })
            .then(trx.commit)
            .catch(trx.rollback)
    })
    .then(() => console.log("transaction successful"))
    .catch(() => console.log("transaction failed"))
}
module.exports = {
    update,
    list,
    read,
    create,
    finishTable,
}