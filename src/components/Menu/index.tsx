import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import { useAuth } from "../../context/userContext";

import {
  Book,
  Today,
  Login,
  AppRegistration,
  PermContactCalendar,
  EventNote,
  Festival,
  PeopleAlt,
} from "@mui/icons-material";
import { IconButton, IconButtonProps, styled } from "@mui/material";
import { Container, Logo, Actions } from "./styles";

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
  const { setUser } = useAuth();

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
        <Actions>
          <NavButton
            style={{
              backgroundColor:
                window.location.pathname === "/calendario" ? "#c9c9c9" : "",
            }}
          >
            <Today />
            <span>Calendário</span>
          </NavButton>
          <NavButton
            style={{
              backgroundColor:
                window.location.pathname === "/contatos" ? "#c9c9c9" : "",
            }}
            onClick={() => {
              navigate("/contatos");
            }}
          >
            <PermContactCalendar />
            <span>Contatos</span>
          </NavButton>
          <NavButton
            style={{
              backgroundColor:
                window.location.pathname === "/eventos" ? "#c9c9c9" : "",
            }}
          >
            <Festival />
            <span>Eventos</span>
          </NavButton>
          <NavButton
            style={{
              backgroundColor:
                window.location.pathname === "/amigos" ? "#c9c9c9" : "",
            }}
            onClick={() => {
              navigate("/amigos");
            }}
          >
            <PeopleAlt />
            <span>Amigos</span>
          </NavButton>
          <NavButton
            style={{
              backgroundColor:
                window.location.pathname === "/notas" ? "#c9c9c9" : "",
            }}
            onClick={() => {
              navigate("/notas");
            }}
          >
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
