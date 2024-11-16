import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    InputBase,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";

const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "auto",
    [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(3),
        width: "auto",
    },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create("width"),
        width: "100%",
        [theme.breakpoints.up("sm")]: {
            width: "12ch",
            "&:focus": {
                width: "20ch",
            },
        },
    },
}));

function NavBar({ searchQuery, onSearchChange }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const isAuthenticated = localStorage.getItem("user");

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        try {
            localStorage.clear();
            window.location.href = "/login";
        } catch (error) {
            console.error("Đăng xuất không thành công", error);
        }
    };

    return (
        <AppBar
            position="static"
            sx={{
                background: "linear-gradient(to left top, #fc6c8f, #ff2ced, #ffb86c)",
            }}
        >
            <Toolbar>
                <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                    School Management
                </Typography>
                <Search>
                    <StyledInputBase
                        placeholder="Tìm kiếm…"
                        inputProps={{ "aria-label": "search" }}
                        value={searchQuery}
                        onChange={onSearchChange}
                    />
                    <SearchIcon />
                </Search>
                <IconButton
                    aria-label="more"
                    aria-controls="menu"
                    aria-haspopup="true"
                    onClick={handleClick}
                    color="inherit"
                >
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    id="menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    {isAuthenticated && (
                        <Link
                            to="/parent/viewsocreandpayment"
                            style={{ textDecoration: "none", color: "inherit" }}
                        >
                            <MenuItem onClick={handleClose}>View Scores and Payments </MenuItem>
                        </Link>
                    )}
                    {isAuthenticated ? (
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    ) : (
                        <Link to="/login" style={{ textDecoration: "none", color: "inherit" }}>
                            <MenuItem onClick={handleClose}>Login</MenuItem>
                        </Link>
                    )}
                </Menu>
            </Toolbar>
        </AppBar>
    );
}


export default NavBar;
