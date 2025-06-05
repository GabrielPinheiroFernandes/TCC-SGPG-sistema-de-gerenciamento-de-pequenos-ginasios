import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Logint";
import Register from "./pages/Register";
import PrivateRoute from "./middlewares/PrivateRoute";
import Profile from "./pages/profile/profile";

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
      </Routes>
    </Router>
  );
}

export default App;
