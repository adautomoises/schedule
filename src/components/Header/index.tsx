import {
  Button,
  ButtonProps,
  IconButton,
  Menu,
  MenuItem,
  styled,
} from "@mui/material";
import { Container } from "./styles";
import { AccountCircle, NotificationsNone, Search } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const ProfileButton = styled(Button)<ButtonProps>({
  color: "gray",
  "&:hover": {
    backgroundColor: "#f0f0f0",
  },
});

export function Header() {
  const navigate = useNavigate();
  const { user, UserSignOut, setUser } = useAuth();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    UserSignOut();
    setAnchorEl(null);
    navigate("/entrar");
    window.location.reload();
  };
  const handleClickProfile = () => {
    handleClose();
    navigate(`/perfil/${user?.nickName}`);
  };

  useEffect(() => {
    api
      .get("/users/getById", {
        params: {
          uuid: localStorage.getItem("@schedule:user-uuid-1.0.0"),
        },
      })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error: Error) => console.log(error));
  }, [setUser]);

  return (
    <Container>
      <div>
        <IconButton>
          <Search />
        </IconButton>
      </div>
      <div>
        <IconButton>
          <NotificationsNone />
        </IconButton>
        <div>
          <ProfileButton
            id="basic-ProfileButton"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            startIcon={<AccountCircle />}
          >
            {user?.nickName}
          </ProfileButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem onClick={handleClickProfile}>Perfil</MenuItem>
            <MenuItem onClick={handleSignOut}>Sair</MenuItem>
          </Menu>
        </div>
      </div>
    </Container>
  );
}
