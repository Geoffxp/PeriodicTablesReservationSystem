import React from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import ListReservations from "./ListReservationsJSX";
import ListTables from "./ListTables";
import { dashDate } from "../utils/dashDate";
import { previous, next, today } from "../utils/date-time";

import "./Dashboard.css";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date, reservations, tables, reservationsError, reload }) {
  const history = useHistory();

  const changeDate = ({ target }) => {
    if (target.value === "prev") {
      history.push(`/dashboard?date=${previous(date)}`)
    }
    if (target.value === "today") {
      history.push(`/dashboard?date=${today()}`)
    }
    if (target.value === "next") {
      history.push(`/dashboard?date=${next(date)}`)
    }
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Here's the breakdown for {dashDate(date)}</h4>
      </div>
      <button
          type="button"
          className="btn btn-lg btn-secondary"
          value="prev"
          onClick={changeDate}>Previous</button>
        <button
          type="button"
          className="btn btn-lg btn-info ml-1"
          value="today"
          onClick={changeDate}>Today</button>
        <button
          type="button"
          className="btn btn-lg btn-primary ml-1"
          value="next"
          onClick={changeDate}>Next</button>
      <ErrorAlert error={reservationsError} />
      <ListReservations reservations={reservations} reload={reload} />
      <ListTables tables={tables} reload={reload} />
    </main>
  );
}

export default Dashboard;
