import { BrowserRouter, Routes, Route } from "react-router-dom";
import LeadForm from "./components/LeadForm";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LeadForm />} />
        <Route path="/login" element={<Login />} />
        <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
      </Routes>
      <ToastContainer position="top-center" autoClose={2000} />
    </BrowserRouter>
  );
}

export default App;