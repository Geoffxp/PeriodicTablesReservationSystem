import React from "react";
import { updateReservation } from "../utils/api";

export default function DisplayReservation({ reservation, reload }) {
    const cancelHandler = () => {
        const confirmation = window.confirm("Do you want to cancel this reservation? This cannot be undone.");
        if (confirmation) {
            const body = {
                status: "cancelled"
            }
            updateReservation(body, reservation.reservation_id, new AbortController().signal)
            .then(() => reload())
        }
    }
    

    const humanTime = (time) => {
        const hour = time.slice(0, 2)
        const minute = time.slice(3, 5)
        if (hour === "0") {
            return `12:${minute} AM`
        } else if (hour >= 1 && hour < 12) {
            return `${hour}:${minute} AM`
        } else if (hour % 12 === 0) {
            return `12:${minute} PM`
        } else {
            return `${hour % 12}:${minute} PM`
        }
    }
    
    const humanDate = (date, time) => {
        return new Date(`${date}, ${time}`).toString().slice(0, 10);
    }

    const capitalize = (str) => {
        let firstLetter = str.slice(0, 1).toUpperCase()
        return firstLetter + str.substr(1)
    }
    return (
        <>
            <div className="beeg">
                <div className="card d-flex flex-row p-1">
                    <div className="card d-flex flex-column col-3 pt-3">
                        <p>{reservation.first_name} {reservation.last_name}</p>
                    </div>
                    <div className="card d-flex flex-column col-3 pt-3">
                        <p>{reservation.mobile_number}</p>
                    </div>
                    <div className="card d-flex flex-column col-3 pt-3">
                        <p>{humanDate(reservation.reservation_date, reservation.reservation_time) + " "} 
                        @ {humanTime(reservation.reservation_time) + " "} 
                        for {reservation.people} 
                        {reservation.people > 1 ? " people" : " person"}</p>
                    </div>
                    <div className="card col-3 pt-1 d-flex flex-row justify-content-between">
                        <div className="col-6 pl-0 ml-0">
                            <p className="pt-3" data-reservation-id-status={reservation.reservation_id}>{capitalize(reservation.status)}</p>
                        </div>
                        <div className="col-6 text-center">
                            {reservation.status === "booked" && 
                            <a className="btn btn-primary btn-md text-right m-1" href={`/reservations/${reservation.reservation_id}/seat`}>Seat</a>}
                            {reservation.status === "booked" && 
                            <a className="btn btn-secondary btn-md text-right m-1" href={`/reservations/${reservation.reservation_id}/edit`}>edit</a>}
                            {reservation.status === "booked" && 
                            <button onClick={cancelHandler} className="btn btn-danger btn-md text-right m-1" data-reservation-id-cancel={reservation.reservation_id}>Cancel</button>}
                        </div>
                        
                    </div>
                </div>
            </div>
            <div className="smol">
                <div className="card d-flex flex-row p-1 mb-2 text-center">
                    <div className="d-flex flex-column pt-3">
                        <p>{reservation.first_name} {reservation.last_name}</p>
                    </div>
                    <div className="d-flex flex-column pt-3">
                        <p>{reservation.mobile_number}</p>
                    </div>
                    <div className="d-flex flex-column pt-3">
                        <p>{humanDate(reservation.reservation_date, reservation.reservation_time) + " "} 
                        @ {humanTime(reservation.reservation_time) + " "} 
                        for {reservation.people} 
                        {reservation.people > 1 ? " people" : " person"}</p>
                    </div>
                    <div className="pt-1 d-flex flex-row justify-content-between">
                        <div>
                            <p className="pt-3" data-reservation-id-status={reservation.reservation_id}>{capitalize(reservation.status)}</p>
                        </div>
                        <div>
                            {reservation.status === "booked" && 
                            <a className="btn btn-primary btn-lg text-right m-1" href={`/reservations/${reservation.reservation_id}/seat`}>Seat</a>}
                            {reservation.status === "booked" && 
                            <a className="btn btn-secondary btn-lg text-right m-1" href={`/reservations/${reservation.reservation_id}/edit`}>edit</a>}
                            {reservation.status === "booked" && 
                            <button onClick={cancelHandler} className="btn btn-danger btn-lg text-right m-1" data-reservation-id-cancel={reservation.reservation_id}>Cancel</button>}
                        </div>
                        
                    </div>
                </div>
            </div>
        </>

        
    )

}