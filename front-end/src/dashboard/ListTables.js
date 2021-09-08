import React from "react";
import DisplayTable from "./DisplayTable";

export default function DisplayTables({ tables, reload }) {

    return (
        <>
            <h1>Tables</h1>
            <div className="beeg">
                <div className="d-flex flex-row">
                    <div className="d-flex flex-column col-4 lead">
                        <p>Name</p>
                    </div>
                    <div className="d-flex flex-column col-4 lead">
                        <p>Capacity</p>
                    </div>
                    <div className="d-flex flex-column col-4 lead">
                        <p>Status</p>
                    </div>
                </div>
            </div>   
            {tables.map((table, index) => <DisplayTable  key={index} table={table} reload={reload}/>)}
        </>
    )
}