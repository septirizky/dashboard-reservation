import {
  Box,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  useTheme,
} from "@mui/material";
import { useState, useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import { useNavigate, useLocation } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CloseIcon from "@mui/icons-material/CloseOutlined";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = () => {
    if (!searchQuery) return;

    if (location.pathname.includes("item_option")) {
      navigate(`/item_option?search=${searchQuery}`);
    } else if (location.pathname.includes("menu")) {
      navigate(`/menu?search=${searchQuery}`);
    } else if (location.pathname.includes("category")) {
      navigate(`/category?search=${searchQuery}`);
    } else if (location.pathname.includes("option")) {
      navigate(`/option?search=${searchQuery}`);
    } else {
      console.log("Search functionality not implemented for this page.");
    }
  };

  const handleProfile = () => {
    setAnchorEl(null);
    navigate("/profile");
  };

  const handleLogout = () => {
    setAnchorEl(null);
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        <InputBase
          sx={{ ml: 2, flex: 1 }}
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <IconButton type="button" sx={{ p: 1 }} onClick={handleSearch}>
          <SearchIcon />
        </IconButton>
        {searchQuery && (
          <IconButton
            type="button"
            sx={{ p: 1 }}
            onClick={() => {
              setSearchQuery("");
              navigate(location.pathname);
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      {/* ICONS */}
      <Box display="flex" alignItems="center">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
          <PersonOutlinedIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem onClick={handleProfile}>Profile</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Topbar;
