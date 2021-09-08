import React from "react";
import { finishTable } from "../utils/api";

export default function DisplayTable({ table, reload }) {
    const finishHandler = () => {
        const confirmation = window.confirm("Is this table ready to seat new guests? This cannot be undone.")
        if (confirmation) {
            finishTable(table.table_id)
                .then(() => reload())
        } else {
            console.log("cancelled")
        }
    }
    return (
        <>
        <div className="beeg">
            <div className="card d-flex flex-row p-1">
                <div className="card d-flex flex-column col-4 pt-3">
                    <p>{table.table_name}</p>
                </div>
                <div className="card d-flex flex-column col-4 pt-3">
                    <p>{table.capacity}</p>
                </div>
                <div className="card d-flex flex-column col-4">
                    {(table.reservation_id) ? 
                        <div className="d-flex flex-row justify-content-between">
                            <p className="pt-3 red" data-table-id-status={table.table_id}>Occupied</p>
                            <button data-table-id-finish={table.table_id} onClick={finishHandler} className="btn btn-lg btn-danger m-1">Finish</button>
                        </div> : 
                    <p className="pt-3 green" data-table-id-status={table.table_id}>Free</p>}
                </div>
            </div>
        </div>
        <div className="smol">
            <div className="card d-flex flex-row p-1 text-center mb-2">
                <div className="d-flex flex-column pt-3">
                    <p>Table name: {table.table_name}</p>
                </div>
                <div className="d-flex flex-column pt-3">
                    <p>Capacity: {table.capacity}</p>
                </div>
                <div className="d-flex flex-column">
                    {(table.reservation_id) ? 
                        <div className="d-flex flex-row justify-content-between">
                            <p className="pt-3 red" data-table-id-status={table.table_id}>Occupied</p>
                            <button data-table-id-finish={table.table_id} onClick={finishHandler} className="btn btn-lg btn-danger m-1">Finish</button>
                        </div> : 
                    <p className="pt-3 green" data-table-id-status={table.table_id}>Free</p>}
                </div>
            </div>
        </div> 
        </>
    )
}