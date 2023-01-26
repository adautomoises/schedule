import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";
import { Menu } from "../components/Menu";

import { Container, View } from "./styles";

export function DefaultLayout() {
  return (
    <Container>
      <Menu />
      <View>
        <Header />
        <Outlet />
      </View>
    </Container>
  );
}
