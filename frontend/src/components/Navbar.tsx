import * as React from "react";

import { useState } from "react";

import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Avatar,
  Button,
  MenuItem,
  Divider,
  useMediaQuery,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/navigation";

import { useDispatch, useSelector } from "react-redux";
import { clearCurrentUser } from "@/slices/userSlice";
import { RootState } from "@/types/types";

import { useTheme } from "@mui/material/styles";

interface Setting {
  label: string;
  url: string;
}

const settings: Setting[] = [
  { label: "Account", url: "account" },
  { label: "Trips", url: "trips" },
  { label: "Reviews", url: "reviews" },
];

export default function Navbar() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const me = useSelector((state: RootState) => state.user.currentUser);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLogout = async () => {
    localStorage.removeItem("token");
    dispatch(clearCurrentUser());
    router.push("/login");
    setAnchorEl(null);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar>
        <Toolbar>
          <Box
            onClick={() => router.push("/")}
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              "&:hover": {
                opacity: 0.8,
              },
            }}
          >
            <Typography variant="h6" component="div">
              <Box component="span" sx={{ color: "white" }}>
                GOD
              </Box>
              <Box component="span" sx={{ color: "#54F49A" }}>
                RIVE
              </Box>
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />
          {isMobile ? (
            <Box>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleMenu}
              >
                {me ? (
                  <Avatar alt={me.email} src={me.pictureUrl} />
                ) : (
                  <MenuIcon />
                )}
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                {me && [
                  <MenuItem
                    key="hello"
                    style={{ pointerEvents: "none" }}
                    sx={{ fontWeight: "bold", textAlign: "center" }}
                  >
                    Hello {me.email} !
                  </MenuItem>,
                  <Divider key="divider1" />,
                ]}
                <MenuItem
                  onClick={() => {
                    router.push("/");
                    handleClose();
                  }}
                >
                  Search Trips
                </MenuItem>
                {me && (
                  <MenuItem
                    onClick={() => {
                      router.push("/trips/new");
                      handleClose();
                    }}
                  >
                    Propose Trip
                  </MenuItem>
                )}
                <Divider />
                {me
                  ? [
                      ...settings.map((setting, index) => (
                        <MenuItem
                          key={index}
                          onClick={() => {
                            router.push(`/${setting.url}`);
                            handleClose();
                          }}
                        >
                          <Typography sx={{ textAlign: "center" }}>
                            {setting.label}
                          </Typography>
                        </MenuItem>
                      )),
                      <Divider key="divider2" />,
                      <MenuItem key="logout" onClick={handleLogout}>
                        Logout
                      </MenuItem>,
                    ]
                  : [
                      <MenuItem
                        key="login"
                        onClick={() => {
                          router.push("/login");
                          handleClose();
                        }}
                      >
                        <Typography sx={{ textAlign: "center" }}>
                          Login
                        </Typography>
                      </MenuItem>,
                      <MenuItem
                        key="register"
                        onClick={() => {
                          router.push("/register");
                          handleClose();
                        }}
                      >
                        <Typography sx={{ textAlign: "center" }}>
                          Register
                        </Typography>
                      </MenuItem>,
                    ]}
              </Menu>
            </Box>
          ) : (
            <Box>
              {me ? (
                <>
                  <Button
                    color="inherit"
                    onClick={() => {
                      router.push("/");
                    }}
                  >
                    Search Trips
                  </Button>
                  <Button
                    color="inherit"
                    onClick={() => {
                      router.push("/trips/new");
                    }}
                  >
                    Propose Trip
                  </Button>
                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                  >
                    <Avatar alt={me.email} src={me.pictureUrl} />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem
                      key="hello"
                      style={{ pointerEvents: "none" }}
                      sx={{ fontWeight: "bold", textAlign: "center" }}
                    >
                      Hello {me.email} !
                    </MenuItem>
                    <Divider />
                    {settings.map((setting, index) => (
                      <MenuItem
                        key={index}
                        onClick={() => {
                          router.push(`/${setting.url}`);
                          handleClose();
                        }}
                      >
                        <Typography sx={{ textAlign: "center" }}>
                          {setting.label}
                        </Typography>
                      </MenuItem>
                    ))}
                    <Divider />
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button
                    color="inherit"
                    onClick={() => {
                      router.push("/");
                    }}
                  >
                    Search Trips
                  </Button>
                  <Button
                    color="inherit"
                    onClick={() => {
                      router.push("/login");
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    color="inherit"
                    onClick={() => {
                      router.push("/register");
                    }}
                  >
                    Register
                  </Button>
                </>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
}
