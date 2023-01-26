import { IconButton, Menu, MenuItem } from "@mui/material";
import { Container } from "./styles";
import { AccountCircle, NotificationsNone, Search } from "@mui/icons-material";
import { useState } from "react";
import { useAuth } from "../../context/userContext";

export function Header() {
  const { UserSignOut } = useAuth();

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
          <IconButton
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
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
