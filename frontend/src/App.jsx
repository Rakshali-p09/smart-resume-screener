import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import CreateJob from "./pages/CreateJob";
import Jobs from "./pages/Jobs";
import UploadResume from "./pages/UploadResume";
import ScreenResume from "./pages/ScreenResume";
import CandidateDetails from "./pages/CandidateDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/register" element={<Register />} />

        <Route path="/login" element={<Login />} />

        <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
              <Dashboard />
              </ProtectedRoute>
           }
        />
        
        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
            <Jobs />
            </ProtectedRoute>
           }
        />
        
        <Route
          path="/create-job"
          element={
            <ProtectedRoute>
            <CreateJob />
            </ProtectedRoute>
          }
        />
       
        <Route
          path="/upload-resume"
          element={
            <ProtectedRoute>
            <UploadResume />
            </ProtectedRoute>
          }
        />

      <Route
        path="/screen-resume"
        element={
          <ProtectedRoute>
          <ScreenResume />
          </ProtectedRoute>
        }
      />

        <Route
          path="/candidate/:id"
          element={
            <ProtectedRoute>
            <CandidateDetails />
            </ProtectedRoute>
          }
        />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;