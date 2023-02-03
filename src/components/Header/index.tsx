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
import { useState } from "react";
import { useAuth } from "../../context/userContext";

const ProfileButton = styled(Button)<ButtonProps>({
  color: "gray",
  "&:hover": {
    backgroundColor: "#f0f0f0",
  },
});

export function Header() {
  const { user, UserSignOut } = useAuth();

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
    window.location.reload();
  };

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
            <MenuItem onClick={handleClose}>Perfil</MenuItem>
            <MenuItem onClick={handleSignOut}>Sair</MenuItem>
          </Menu>
        </div>
      </div>
    </Container>
  );
}
