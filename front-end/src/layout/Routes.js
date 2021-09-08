import React, { useState, useEffect } from "react";
import { listReservations, listTables } from "../utils/api";
import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import ReservationForm from "./ReservationForm";
import TableForm from "./TableForm"
import SeatReservation from "./SeatReservation";
import Search from "./Search";
import useQuery from "../utils/useQuery"
/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const query = useQuery();
  const date = query.get("date") ? query.get("date") : today();
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  
  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    listTables(abortController.signal).then(setTables);
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/search">
        <Search reload={loadDashboard}/>
      </Route>
      <Route path="/tables/new">
        <TableForm reload={loadDashboard}/>
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <SeatReservation reservations={reservations} tables={tables} reload={loadDashboard}/>
      </Route>
      <Route path="/reservations/:reservation_id/edit">
        <ReservationForm reload={loadDashboard} />
      </Route>
      <Route path="/reservations/new">
        <ReservationForm reload={loadDashboard}/>
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/tables">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={date} reservations={reservations} tables={tables} reservationsError={reservationsError} reload={loadDashboard}/>
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
