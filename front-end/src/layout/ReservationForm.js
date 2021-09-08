import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { createReservation, readReservation, updateReservation } from "../utils/api";
import { formatAsDate, today } from "../utils/date-time";

export default function ReservationForm({ reload }) {
    const params = useParams();
    const date = today();
    const history = useHistory();
    const [showAlert, setShowAlert] = useState("none");
    const [errorDisplay, setErrorDisplay] = useState([]);

    const init = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: date,
        reservation_time: "10:30",
        people: 1
    };
    const [reservation, setReservation] = useState({...init});

    useEffect(() => {
        if (params.reservation_id) {
            readReservation(params.reservation_id, new AbortController().signal)
                .then((response) => setReservation({
                    ...response,
                    reservation_date: formatAsDate(response.reservation_date)
                }));
        }
        return () => new AbortController().abort();
    }, [params])

    const changeHandler = ({ target }) => {
        setReservation({
            ...reservation,
            [target.name]: target.value
        })
    }
    const dateAndTimeCheck = () => {
        const todaysDate = new Date();
        const dateToCheck = new Date(`${reservation.reservation_date}, ${reservation.reservation_time}`);
        const day = dateToCheck.getDay();
        const hour = dateToCheck.getHours();
        const minutes = dateToCheck.getMinutes();
        const errorList = [];
        if (dateToCheck < todaysDate) {
            errorList.push({error_id: "past", message: "Date must not be in the past!"});
        } 
        if (day === 2) {
            errorList.push({error_id: "tuesday", message: "We are closed on Tuesday!"});
        }
        if (hour < 10 || hour > 21 || (hour === 10 && minutes < 30) || (hour === 21 && minutes > 30)) {
            errorList.push({error_id: "hours", message: "Reservation must be between 10:30 AM and 9:30 PM"});
        }
        return errorList
    }

    const submitHandler = (event) => {
        if(params.reservation_id) {
            event.preventDefault();
            const errorList = dateAndTimeCheck();
            if (errorList.length) {
                setErrorDisplay(errorList);
                setShowAlert("block");
            } else {
                setShowAlert("none");
                setErrorDisplay([]);
                updateReservation(reservation, params.reservation_id, new AbortController().signal)
                    .then(() => reload())
                    .then(() => history.push(`/dashboard?date=${reservation.reservation_date}`));
            }
            
        } else {
            event.preventDefault();
            const errorList = dateAndTimeCheck();
            if (errorList.length) {
                setErrorDisplay(errorList);
                setShowAlert("block");
            } else {
                setShowAlert("none");
                setErrorDisplay([]);
                createReservation(reservation)
                    .then(() => reload())
                    .then(() => history.push(`/dashboard?date=${reservation.reservation_date}`));
            }
        }
    }

    const cancelHandler = () => {
        setReservation({...init});
        history.goBack();
    }

    return (
        <>
            {params.reservation_id ? 
            <h1 className="text-center">Edit Reservation</h1> :
            <h1 className="text-center">New Reservation</h1>}
            {errorDisplay.map((error) => {
                return <div className="alert alert-danger" key={error.error_id} style={{display: `${showAlert}`}}>{error.message}</div>
            })}
            <form className="container pt-3" onSubmit={submitHandler}>
                <div className="form-row">
                    <div className="col-md-4 mb-3">
                        <input 
                            type="text" 
                            className="form-control" 
                            name="first_name" 
                            placeholder="First name"
                            onChange={changeHandler}
                            value={reservation.first_name}
                            required />
                    </div>
                    <div className="col-md-4 mb-3">
                        <input 
                            type="text" 
                            className="form-control" 
                            name="last_name" 
                            placeholder="Last name"
                            onChange={changeHandler}
                            value={reservation.last_name}
                            required />
                    </div>
                    <div className="col-md-4 mb-3">
                        <input 
                            type="text" 
                            className="form-control" 
                            name="mobile_number" 
                            placeholder="Mobile number"
                            onChange={changeHandler}
                            value={reservation.mobile_number}
                            required />
                    </div>
                </div>
                <div className="form-row">
                    <div className="col-md-4 mb-3">
                        <input 
                            type="date" 
                            className="form-control" 
                            name="reservation_date" 
                            onChange={changeHandler}
                            value={reservation.reservation_date}
                            required />
                    </div>
                    <div className="col-md-4 mb-3">
                        <input 
                            type="time" 
                            className="form-control" 
                            name="reservation_time" 
                            placeholder="Time"
                            onChange={changeHandler}
                            value={reservation.reservation_time}
                            required />
                    </div>
                    <div className="col-md-4 mb-3">
                        <input
                            type="number"
                            className="form-control"
                            name="people"
                            placeholder="Number of people"
                            onChange={changeHandler}
                            value={reservation.people}
                            required />
                    </div>
                </div>
                <div className="d-flex flex-row justify-content-center">
                    <button type="cancel" onClick={cancelHandler} className="btn btn-secondary btn-lg mr-1">Cancel</button>
                    <button type="submit" className="btn btn-light btn-lg ml-1">Submit</button>
                </div>
                
            </form>
        </>
    )
}
