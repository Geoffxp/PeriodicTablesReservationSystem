import React from "react";
import DisplayReservation from "./DisplayReservation";

export default function ListReservationsJSX({ reservations, reload }) {
    return (
        <>
            <h1>Reservations</h1>
            <div className="beeg">
                <div className="d-flex flex-row">
                    <div className="d-flex flex-column col-3 lead">
                        <p>Name</p>
                    </div>
                    <div className="d-flex flex-column col-3 lead">
                        <p>Mobile Phone</p>
                    </div>
                    <div className="d-flex flex-column col-3 lead">
                        <p>Reservation Details</p>
                    </div>
                    <div className="d-flex flex-column col-3 lead">
                        <p>Status</p>
                    </div>
                </div>
            </div>
            {reservations.map((reservation) => <DisplayReservation key={reservation.reservation_id} reservation={reservation} reload={reload} />)}
        </>
    )
}
