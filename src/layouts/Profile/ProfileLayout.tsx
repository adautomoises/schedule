import { Outlet } from "react-router-dom";
import { Header } from "../../components/Header";

import { Container } from "../Profile/styles";

export function ProfileLayout() {
  return (
    <Container>
      <Header />
      <Outlet />
    </Container>
  );
}
