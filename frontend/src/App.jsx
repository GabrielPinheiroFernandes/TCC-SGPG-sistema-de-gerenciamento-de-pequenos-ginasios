import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Logint";
import Register from "./pages/Register";
import PrivateRoute from "./middlewares/PrivateRoute";
import Profile from "./pages/profile/profile";
import Students from "./pages/profile/components/admin/components/students/students";
import Student from "./pages/profile/components/admin/components/student/student";
import Bioimpedancia from "./pages/bioempendance";
import Dashboard from "./pages/profile/components/admin/components/dashboard/dashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota pública */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
         <Route path="/bioempendancia" element={<Bioimpedancia />} />

        {/* Rotas protegidas */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
             <Profile/>
            </PrivateRoute>
          }
        />
         <Route
          path="/students"
          element={
            <PrivateRoute>
             <Students />
            </PrivateRoute>
          }
        />
         <Route
          path="/students/:id"
          element={
            <PrivateRoute>
             <Student />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
             <Dashboard/>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
