import {
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import ProtectedRoute from "../components/common/ProtectedRoute";

import Home from "../pages/Home";
import Movies from "../pages/Movies";
import MovieDetail from "../pages/MovieDetail";
import Showtimes from "../pages/Showtimes";
import Booking from "../pages/Booking";
import Checkout from "../pages/Checkout";
import Ticket from "../pages/Ticket";
import MyTickets from "../pages/MyTickets";
import NotFound from "../pages/NotFound";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import Dashboard from "../pages/admin/Dashboard";
import MovieManagement from "../pages/admin/MovieManagement";
import CinemaManagement from "../pages/admin/CinemaManagement";
import RoomManagement from "../pages/admin/RoomManagement";
import ShowtimeManagement from "../pages/admin/ShowtimeManagement";
import UserManagement from "../pages/admin/UserManagement";
import Revenue from "../pages/admin/Revenue";


function AppRoutes() {
  return (
    <>

      <Navbar />



      <main>

        <Routes>


          <Route
            path="/"
            element={
              <Home />
            }
          />

          <Route
            path="/movies"
            element={
              <Movies />
            }
          />

          <Route
            path="/movies/:id"
            element={
              <MovieDetail />
            }
          />

          <Route
            path="/showtimes"
            element={
              <Showtimes />
            }
          />



          <Route
            path="/login"
            element={
              <Login />
            }
          />

          <Route
            path="/register"
            element={
              <Register />
            }
          />



          <Route
            path="/booking/:showtimeId"
            element={
              <ProtectedRoute role="CUSTOMER">
                <Booking />
              </ProtectedRoute>
            }
          />



          <Route
            path="/checkout/:showtimeId"
            element={
              <ProtectedRoute role="CUSTOMER">
                <Checkout />
              </ProtectedRoute>
            }
          />



          <Route
            path="/ticket/:id"
            element={
              <ProtectedRoute role="CUSTOMER">
                <Ticket />
              </ProtectedRoute>
            }
          />



          <Route
            path="/my-tickets"
            element={
              <ProtectedRoute role="CUSTOMER">
                <MyTickets />
              </ProtectedRoute>
            }
          />



          <Route
            path="/admin"
            element={
              <ProtectedRoute role="ADMIN">
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/movies"
            element={
              <ProtectedRoute role="ADMIN">
                <MovieManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/cinemas"
            element={
              <ProtectedRoute role="ADMIN">
                <CinemaManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/rooms"
            element={
              <ProtectedRoute role="ADMIN">
                <RoomManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/showtimes"
            element={
              <ProtectedRoute role="ADMIN">
                <ShowtimeManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute role="ADMIN">
                <UserManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/revenue"
            element={
              <ProtectedRoute role="ADMIN">
                <Revenue />
              </ProtectedRoute>
            }
          />



          <Route
            path="*"
            element={
              <NotFound />
            }
          />

        </Routes>

      </main>



      <Footer />

    </>
  );
}

export default AppRoutes;