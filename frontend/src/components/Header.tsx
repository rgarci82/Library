import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import "./Header.css";

const Header: React.FC = () => {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [studentId, setStudentId] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    studentId: "",
  });

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleSubmit = () => {
    let valid = true;
    let errors = { email: "", password: "", studentId: "" };

    if (!email) {
      errors.email = "Email is required";
      valid = false;
    }
    if (!password) {
      errors.password = "Password is required";
      valid = false;
    }
    if (!studentId) {
      errors.studentId = "Student ID is required";
      valid = false;
    }

    setErrors(errors);

    if (valid) {
      handleDialogClose();
    }
  };

  return (
    <AppBar position="fixed" className="header">
      <Toolbar>
        <Button
          className="hover-effect"
          color="inherit"
          onClick={handleDialogOpen}
          style={{ color: "black", fontFamily: "Lato" }}
        >
          Log In/Register
        </Button>
        <Typography
          variant="h6"
          style={{
            flexGrow: 1,
            textAlign: "center",
            color: "black",
            fontFamily: "Lato",
            fontSize: 34,
          }}
        >
          Library Database
        </Typography>
        <IconButton
          className="hover-effect"
          edge="end"
          color="inherit"
          onClick={handleMenuOpen}
          style={{ color: "black" }}
        >
          {menuAnchorEl ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
      </Toolbar>
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          style: {
            backgroundColor: "#f5f5dc",
            width: "100%",
            top: "50px",
            left: "0",
            right: "0",
          },
        }}
        MenuListProps={{
          style: {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          },
        }}
      >
        <MenuItem className="menu-item" onClick={handleMenuClose}>
          Profile
        </MenuItem>
        <MenuItem className="menu-item" onClick={handleMenuClose}>
          Settings
        </MenuItem>
        <MenuItem className="menu-item" onClick={handleMenuClose}>
          Log Out
        </MenuItem>
      </Menu>
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Log In/Register</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
          />
          <TextField
            margin="dense"
            label="Student ID"
            type="text"
            fullWidth
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            error={!!errors.studentId}
            helperText={errors.studentId}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
};

export default Header;
