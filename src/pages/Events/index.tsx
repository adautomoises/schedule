import { useState } from "react";
import { Add, Cancel } from "@mui/icons-material";
import Button from "@mui/material/Button/Button";

import { Container } from "./styles";
import Modal from "@mui/material/Modal/Modal";
import Box from "@mui/material/Box/Box";

export function Events() {
  const [openModal, setOpenModal] = useState(false);

  const handleEventModal = () => {
    setOpenModal(!openModal);
  };

  return (
    <Container>
      <Button
        onClick={handleEventModal}
        color="primary"
        variant="outlined"
        startIcon={<Add />}
      >
        Evento
      </Button>
      <Modal open={openModal} onClose={handleEventModal}>
        <Box sx={boxStyle} style={{ display: "flex", flexDirection: "column" }}>
          <Button
            onClick={handleEventModal}
            color="primary"
            variant="outlined"
            startIcon={<Cancel />}
          >
            Fechar
          </Button>
        </Box>
      </Modal>
    </Container>
  );
}

const boxStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 1,
  boxShadow: 24,
  p: 4,
  gap: 1,
};
