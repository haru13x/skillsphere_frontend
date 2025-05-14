import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Tooltip,
  Menu,
  Button,
  MenuItem,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListAltIcon from "@mui/icons-material/ListAlt";
import WorkIcon from "@mui/icons-material/Work";
import MessageIcon from "@mui/icons-material/Message";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const navigate = useNavigate();
  const [projectMenuAnchorEl, setProjectMenuAnchorEl] = useState(null); // Menu for Projects
  const [settingsMenuAnchorEl, setSettingsMenuAnchorEl] = useState(null); // Menu for Profile/Logout
  const user = JSON.parse(localStorage.getItem("user"));

  // Open/Close Project Menu
  const handleOpenProjectMenu = (event) => {
    setProjectMenuAnchorEl(event.currentTarget);
  };
  const handleCloseProjectMenu = () => {
    setProjectMenuAnchorEl(null);
  };

  // Open/Close Settings Menu
  const handleOpenSettingsMenu = (event) => {
    setSettingsMenuAnchorEl(event.currentTarget);
  };
  const handleCloseSettingsMenu = () => {
    setSettingsMenuAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleProjectMenuClick = (route) => {
    navigate(route);
    handleCloseProjectMenu(); // Close menu after selection
  };

  return (
    <AppBar position="static" className="bg-white shadow-sm">
      <Toolbar className="flex justify-between overflow-auto">
        {/* Left Side */}
        <Box className="flex items-center">
          <IconButton onClick={() => navigate("/dashboard")} color="primary">
            <DashboardIcon />
          </IconButton>
          <Typography
            variant="body1"
            onClick={() => navigate("/dashboard")}
            className="hidden sm:block cursor-pointer"
          >
            Dashboard
          </Typography>

          <IconButton onClick={() => navigate("/tasklist")} color="primary">
            <ListAltIcon />
          </IconButton>
          <Typography
            variant="body1"
            onClick={() => navigate("/tasklist")}
            className="hidden sm:block cursor-pointer"
          >
            Taskbar
          </Typography>

          {/* My Projects Menu */}
          <IconButton
            color="primary"
            onClick={handleOpenProjectMenu}
            aria-controls={projectMenuAnchorEl ? "project-menu" : undefined}
            aria-haspopup="true"
          >
            <WorkIcon />
          </IconButton>
          <Typography
            variant="body1"
            onClick={handleOpenProjectMenu}
            className="hidden sm:block cursor-pointer"
          >
            Projects
          </Typography>

          {/* Project Menu */}
          <Menu
            anchorEl={projectMenuAnchorEl}
            open={Boolean(projectMenuAnchorEl)}
            onClose={handleCloseProjectMenu}
            MenuListProps={{
              onMouseLeave: handleCloseProjectMenu,
            }}
          >
            <MenuItem onClick={() => handleProjectMenuClick("/project")}>
              My Project
            </MenuItem>

            <MenuItem
              onClick={() => handleProjectMenuClick("/project/applied")}
            >
              Applied Projects
            </MenuItem>
          </Menu>

          <IconButton onClick={() => navigate("/messages")} color="primary">
            <MessageIcon />
          </IconButton>
          <Typography
            variant="body1"
            onClick={() => navigate("/messages")}
            className="hidden sm:block cursor-pointer"
          >
            Messages
          </Typography>
        </Box>

        {/* Right Side - User */}
        <Box className="flex items-center space-x-2">
          <Button
            variant="contained"
            sx={{
              backgroundColor: "green",
              "&:hover": { backgroundColor: "#1e40af" },
              borderRadius: "12px",
              textTransform: "capitalize",
              px: 3,
              py: 1.5,
              fontWeight: 600,
            }}
            onClick={() => navigate("/add/work")}
          >
            Create New Work
          </Button>
          {/* Settings Menu */}
          {user && (
            <Box className="flex items-center gap-3 px-3 py-1 bg-gray-100 rounded-full shadow-sm hover:shadow-md transition duration-300">
              <Avatar
                src="/assets/user.jpg"
                alt={user.username}
                className="w-9 h-9 ring-2 ring-blue-500"
              />
              <Typography
                variant="body1"
                className="text-sm sm:text-base font-semibold text-gray-800"
              >
                {user.username}
              </Typography>
              <Tooltip title="Profile Options" arrow>
                <IconButton
                  onClick={handleOpenSettingsMenu}
                  size="small"
                  sx={{ p: 0.5 }}
                  className="hover:bg-gray-200 transition duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 12h.01M12 12h.01M18 12h.01"
                    />
                  </svg>
                </IconButton>
              </Tooltip>
            </Box>
          )}

          {/* Settings Menu (Profile and Logout) */}
          <Menu
            anchorEl={settingsMenuAnchorEl}
            open={Boolean(settingsMenuAnchorEl)}
            onClose={handleCloseSettingsMenu}
            MenuListProps={{
              onMouseLeave: handleCloseSettingsMenu,
            }}
          >
            <MenuItem
              onClick={() => {
                handleCloseSettingsMenu();
                navigate("/profile");
              }}
            >
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
