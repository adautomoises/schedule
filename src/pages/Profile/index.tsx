import { useAuth } from "../../context/userContext";
import { Container, Menu, Item } from "./styles";

export function Profile() {
  const { user } = useAuth();

  const url = window.location.pathname;

  url.slice(8) === user?.nickName ? console.log(true) : console.log(false);

  return (
    <Container>
      <Menu></Menu>
      <Item></Item>
    </Container>
  );
}
