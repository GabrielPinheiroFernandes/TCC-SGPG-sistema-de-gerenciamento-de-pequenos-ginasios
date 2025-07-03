import { useEffect, useState } from "react";
import { GetUser } from "../api/endpoints/auth";
import parseToken from "../auth/validate_token";
import { User, User_token } from "../constants/localstorage";
import { useNavigate } from "react-router-dom";

import { Button, IconButton, Tooltip, Box } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';

export default function NavBar() {
  const [userName, setUserName] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [hover, setHover] = useState(false);
  const token = localStorage.getItem(User_token);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const parsed = parseToken(token);
          const { data } = await GetUser(parsed.id, token);
          localStorage.setItem(User, JSON.stringify(data));
          setUserName(data.first_name + " " + data.last_name);
          setUserImage(data.user_image);
        } catch (error) {
          console.error("Erro ao buscar usuário:", error);
        }
      }
    };

    fetchUser();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem(User_token);
    localStorage.removeItem(User);
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full flex justify-between items-center px-6 py-4 bg-black text-white">
      <button
        className="text-2xl font-bold hover:opacity-80"
        onClick={() => navigate("/")}
      >
        STUDIO <span className="text-blue-800">FOCUS</span>
      </button>

      <nav className="hidden md:flex space-x-6">
        <a href="/bioempendancia" className="hover:text-blue-400">
          Bioempendância
        </a>
      </nav>

      {userName ? (
        <Box
          className="flex items-center space-x-2 cursor-pointer"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={() => navigate("/profile")}
          sx={{ fontFamily: "'Koulen', cursive", userSelect: 'none' }}
        >
          <span className="font-semibold">{userName}</span>
          {userImage && (
            <img
              src={userImage}
              alt="User"
              className="w-10 h-10 rounded-full"
              style={{ objectFit: 'cover' }}
            />
          )}
          {hover && (
            <Tooltip title="Sair">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation(); // pra não disparar o navigate("/profile")
                  handleLogout();
                }}
                sx={{
                  color: 'white',
                  ml: 1,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' },
                }}
              >
                <LogoutIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/login")}
        >
          Fazer Login
        </Button>
      )}
    </header>
  );
}
