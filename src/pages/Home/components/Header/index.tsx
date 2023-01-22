import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { Container } from "./styles";
import { Book } from "@mui/icons-material";

export function Header() {
  const navigate = useNavigate();

  return (
    <Container>
      <div>
        <Book color="primary" style={{ fontSize: "64px" }} />
      </div>
      <div>
        <Button
          variant="contained"
          onClick={() => {
            navigate("/entrar");
          }}
        >
          Entrar
        </Button>
        <Button
          variant="text"
          onClick={() => {
            navigate("/cadastrar");
          }}
        >
          Cadastrar
        </Button>
      </div>
    </Container>
  );
}
