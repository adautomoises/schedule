import { Header } from "./components/Header";
import { Menu } from "./components/Menu";
import { Container, View } from "./styles";

export function Home() {
  return (
    <Container>
      <Menu />
      <View>
        <Header />
      </View>
    </Container>
  );
}
