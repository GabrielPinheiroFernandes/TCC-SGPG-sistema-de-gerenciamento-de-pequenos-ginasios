import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Logint";
import Register from "./pages/Register";
import PrivateRoute from "./middlewares/PrivateRoute";
import Profile from "./pages/profile/profile";
import Students from "./pages/profile/components/admin/components/students/students";

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota pública */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

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
      </Routes>
    </Router>
  );
}

export default App;
