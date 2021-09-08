import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";

export default function TableForm({ reload }) {
    const history = useHistory();
    const init = {
        table_name: "",
        capacity: ""
    }

    const [table, setTable] = useState({...init});
    const [errorDisplay, setErrorDisplay] = useState([]);
    const [showAlert, setShowAlert] = useState("none");

    const formCheck = () => {
        const errorList = []
        if (table.capacity < 1) {
            errorList.push("Table capacity must be at least 1");
        }
        if (table.table_name.length < 2) {
            errorList.push("Table name must be at least 2 characters long");
        }
        return errorList;
    }

    

    const changeHandler = ({ target }) => {
        setTable({
            ...table,
            [target.name]: target.value
        })
    }

    const submitHandler = (event) => {
        event.preventDefault();
        const errorList = formCheck();
        if (errorList.length) {
            setErrorDisplay(errorList);
            setShowAlert("block");
        } else {
            setShowAlert("none")
            setErrorDisplay([]);
            createTable(table, new AbortController().abort())
                .then(() => reload());
            setTable({...init});
            history.push("/");
        }
    }
    
    const cancelHandler = () => {
        history.push("/");
    }

    return (
        <>
            <h1 className="text-center">New Table</h1>
            {errorDisplay.map((error, index) => {
                return <div className="alert alert-danger" key={index} style={{display: `${showAlert}`}}>{error}</div>
            })}
            <form className="container" onSubmit={submitHandler}>
                <div className="form-row mb-3">
                    <input 
                        type="text" 
                        className="form-control" 
                        name="table_name" 
                        placeholder="Table name"
                        onChange={changeHandler}
                        value={table.table_name}
                        required />
                </div>
                <div className="form-row mb-3">
                    <input
                        type="text"
                        className="form-control"
                        name="capacity"
                        placeholder="Table capacity"
                        onChange={changeHandler}
                        value={table.capacity}
                        required />
                </div>
                <div className="d-flex flex-row justify-content-center">
                    <button onClick={cancelHandler} className="btn btn-lg btn-secondary mr-2" type="cancel">Cancel</button>
                    <button className="btn btn-lg btn-light mr-2" type="submit">Submit</button>
                </div>
            </form>
        </>
    )
}


