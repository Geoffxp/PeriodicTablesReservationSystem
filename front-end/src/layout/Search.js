import React, { useState } from "react";
import { listReservations } from "../utils/api";
import ListReservationsJSX from "../dashboard/ListReservationsJSX";


export default function Search({ reload }) {
    const [reservations, setReservations] = useState([])
    const [number, setNumber] = useState("")
    const [firstSearch, setFirstSearch] = useState("none")

    const handleChange = ({ target }) => {
        setFirstSearch("none")
        setNumber(target.value)
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        setFirstSearch("block")
        const abortController = new AbortController();
        listReservations({ mobile_number: number }, abortController.signal)
        .then(setReservations)
    }
    return (
        <>
            <h1 className="text-center" >Find a reservation</h1>
            <form className="container" onSubmit={handleSubmit}>
                <div className="form-row mb-3">
                    <input 
                        className="form-control" 
                        type="text" name="mobile_number" 
                        value={number} 
                        onChange={handleChange} 
                        placeholder="Enter a customer's phone number"/>
                </div>
                <div className="d-flex flex-row justify-content-center">
                    <button className="btn btn-lg btn-light mr-2" type="submit">Submit</button>
                </div>
            </form>
            {reservations.length ? 
                <ListReservationsJSX 
                    reservations={reservations} 
                    reload={reload} 
                    setReservations={setReservations} 
                    number={number}/> :
            <h1 className="text-center" style={{display: firstSearch}}>No reservations found!</h1>}
        </>
    )
}