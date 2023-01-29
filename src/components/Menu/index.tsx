import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import { useAuth } from "../../context/userContext";

import {
  AccountCircle,
  Book,
  Today,
  Login,
  AppRegistration,
  AutoAwesome,
  PermContactCalendar,
  EventNote,
  Festival,
} from "@mui/icons-material";
import { IconButton, IconButtonProps, styled } from "@mui/material";
import { Container, Logo, UserInfo, Actions } from "./styles";

const NavButton = styled(IconButton)<IconButtonProps>({
  borderRadius: 10,
  width: "90%",
  display: "flex",
  justifyContent: "flex-start",
  paddingLeft: 12,
  gap: 12,
  marginBottom: 12,
});

export function Menu() {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(false);
  const { user, setUser } = useAuth();

  useEffect(() => {
    api
      .get("/users/getById", {
        params: {
          uuid: localStorage.getItem("@schedule:user-uuid-1.0.0"),
        },
      })
      .then((response) => {
        setUser(response.data);
        setIsAuth(true);
      })
      .catch((error: Error) => console.log(error));
  }, [setUser]);
  
  return (
    <Container>
      <Logo>
        <Book
          color="primary"
          style={{ fontSize: "64px" }}
          onClick={() => {
            navigate("/");
          }}
        />
      </Logo>
      {isAuth ? (
        <UserInfo>
          <AccountCircle />
          <span>{user?.nickName}</span>
        </UserInfo>
      ) : (
        <UserInfo>
          <AutoAwesome />
          <span>Olá, bem-vindo!</span>
          <AutoAwesome />
        </UserInfo>
      )}

      {isAuth ? (
        <Actions>
          <NavButton>
            <Today />
            <span>Agenda</span>
          </NavButton>
          <NavButton
            onClick={() => {
              navigate("/contatos");
            }}
          >
            <PermContactCalendar />
            <span>Contatos</span>
          </NavButton>
          <NavButton>
            <Festival />
            <span>Eventos</span>
          </NavButton>
          <NavButton>
            <EventNote />
            <span>Notas</span>
          </NavButton>
        </Actions>
      ) : (
        <Actions>
          <NavButton
            onClick={() => {
              navigate("/entrar");
            }}
          >
            <Login />
            <span>Entrar</span>
          </NavButton>
          <NavButton
            onClick={() => {
              navigate("/cadastrar");
            }}
          >
            <AppRegistration />
            <span>Cadastrar</span>
          </NavButton>
        </Actions>
      )}
    </Container>
  );
}
