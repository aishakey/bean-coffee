import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Coffeeshops from "./pages/Coffeeshops";
import Coffeeshop from "./pages/Coffeeshop";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import UserProfile from "./pages/UserProfile";
import CreateReview from "./pages/CreateReview";
import UserReviews from "./pages/UserReviews";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { useNavigate } from "react-router-dom";
import "./App.css";

const AppWithRouter = () => {
  const navigate = useNavigate();

  return (
    <AuthProvider navigate={navigate}>
      <div className="app-container">
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/coffeeshops" element={<Coffeeshops />} />
            <Route path="/coffeeshops/:id" element={<Coffeeshop />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            {/* Protected routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-review"
              element={
                <ProtectedRoute>
                  <CreateReview />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-reviews"
              element={
                <ProtectedRoute>
                  <UserReviews />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
        <Footer />
      </div>
    </AuthProvider>
  );
};

const App = () => {
  return (
    <Router>
      <AppWithRouter />
    </Router>
  );
};

export default App;
