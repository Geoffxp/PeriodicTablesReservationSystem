import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { seatReservation, readReservation } from "../utils/api";

export default function SeatReservation({ reservations, tables, reload }) {
    const params = useParams();
    const { reservation_id } = useParams();
    const history = useHistory()
    const [reservation, setReservation] = useState({});
    const [showAlert, setShowAlert] = useState("none");
    const [errorDisplay, setErrorDisplay] = useState([])
    const [currentTable, setCurrentTable] = useState(-1)

    useEffect(() => {
        if (tables.length) {
            setCurrentTable(tables[0].table_id)
        }
        readReservation(Number(reservation_id), new AbortController().abort())
            .then((response) => setReservation(response))
        
        return () => new AbortController().abort()
    }, [reservation_id, tables])

    const tableCheck = () => {
        
        const errors = [];
        const tableToCheck = tables.find((table) => table.table_id === currentTable)
        if (tableToCheck) {
            if (reservation.people > tableToCheck.capacity) {
                errors.push({error_id: "capacity", message: "This table does not have enough room for this reservation"})
            }
            if (tableToCheck.reservation_id !== null) {
                errors.push({error_id: "occupied", message: "This table is already occupied"})
            }
        }
        if (currentTable === -1) {
            errors.push({error_id: "loading", message: "Tables were not loaded, please try again."})
        }
        return errors
    }
    const changeHandler = ({ target }) => {
        setCurrentTable(Number(target.value))
    }
    const cancelHandler = () => {
        history.push("/")
    }
    const submitHandler = (event) => {
        event.preventDefault();
        const errorList = tableCheck();
        if (errorList.length) {
            setErrorDisplay(errorList);
            setShowAlert("block")
        } else {
            seatReservation(currentTable, 
                reservation.reservation_id, 
                new AbortController().abort())
                .then(() => reload());
            setShowAlert("none");
            setCurrentTable(null)
            history.push("/");
        }
    }
    return (
        <>
            <h1>Seat reservation {params.reservation_id}</h1>
            {errorDisplay.map((error) => <div className="alert alert-danger" key={error.error_id} style={{display: `${showAlert}`}}>{error.message}</div>)}
            <form onSubmit={submitHandler}>
                <div className="d-flex flex-column">
                <label htmlFor="table_id">Select a table</label>
                    <select value={currentTable} name="table_id" onChange={changeHandler}>
                        {tables.map((table, index) => {
                            return (
                                <option value={table.table_id} key={index}>{table.table_name} - {table.capacity}</option>
                            )
                        })}
                    </select>
                </div>
                <button type="cancel" onClick={cancelHandler} className="btn btn-lg btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-lg btn-light">Submit</button>
            </form>
            
            
        </>
    )
}
