import { useEffect, useState } from "react";
import api from "../../services/api";

import {
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  OutlinedInput,
  InputLabel,
  FormControl,
  styled,
  FormControlProps,
  Modal,
  Button,
  Box,
} from "@mui/material";

import { Container, FormContainer, Header } from "./styles";
import {
  Close,
  Delete,
  Done,
  MoreVert,
  Search,
  Add,
} from "@mui/icons-material";
import { useForm } from "react-hook-form";

interface IFormInputs {
  uuid: string;
  name: string;
  nickname: string;
  phoneNumber: number;
}

const Form = styled(FormControl)<FormControlProps>({
  width: 300,
});

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export function Contacts() {
  const scheduleUUID = localStorage.getItem(
    "@schedule:user-schedule-uuid-1.0.0"
  );
  const [contacts, setContacts] = useState<IFormInputs[]>();
  const [indexes, setIndexes] = useState<number | null>(null);
  const [edit, setEdit] = useState(false);
  const [checked, setChecked] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { register, handleSubmit, reset } = useForm<IFormInputs>();

  const onSubmit = (data: IFormInputs) => {
    let request = {
      name: data.name,
      nickname: data.nickname,
      phoneNumber: data.phoneNumber,
    };

    api
      .patch(`/contacts`, request, {
        params: {
          uuid: data.uuid,
        },
      })
      .then((response) => {
        console.log(response.data);
        window.location.reload();
      })
      .catch((error: Error) => console.log(error));
  };

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    setAnchorEl(event.currentTarget);
    setIndexes(index);
    setEdit(false);
    reset();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setEdit(true);
    handleClose();
  };

  const handleDelete = () => {
    // api
    // .patch(`/contacts`, request, {
    //   params: {
    //     uuid: data.uuid,
    //   },
    // })
    // .then((response) => {
    //   console.log(response.data);
    //   window.location.reload();
    // })
    // .catch((error: Error) => console.log(error));

    handleClose();
  };

  useEffect(() => {
    api
      .get("/contacts", {
        params: {
          scheduleUUID: scheduleUUID,
        },
      })
      .then((response) => setContacts(response.data))
      .catch((error: Error) => console.log(error));
  }, []);

  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const newContact = (data: IFormInputs) => {
    let request = {
      name: data.name,
      nickname: data.nickname,
      phoneNumber: data.phoneNumber,
    };

    api
      .post(`/contacts`, request, {
        params: {
          scheduleUUID: scheduleUUID,
        },
      })
      .then((response) => {
        console.log(response.data);
        window.location.reload();
      })
      .catch((error: Error) => console.log(error));
  };

  return (
    <Container>
      <FormContainer>
        <Header>
          {checked ? (
            <>
              <div>{checked}</div>
              <div>
                <IconButton>
                  <Delete />
                </IconButton>
              </div>
            </>
          ) : (
            <>
              <div>
                <OutlinedInput
                  startAdornment={<Search />}
                  placeholder="Pesquise um nome..."
                />
              </div>
              <div>
                <IconButton onClick={handleOpenModal}>
                  <Add />
                </IconButton>
                <Modal
                  open={openModal}
                  onClose={handleCloseModal}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style}>
                    <form onSubmit={handleSubmit(newContact)}>
                      <InputLabel>name</InputLabel>
                      <OutlinedInput
                        label="name"
                        {...register("name")}
                        defaultValue="Adauto Moisés"
                      />
                      <InputLabel>nickname</InputLabel>
                      <OutlinedInput
                        label="nickname"
                        {...register("nickname")}
                        defaultValue="moandleandro"
                      />
                      <InputLabel>phoneNumber</InputLabel>
                      <OutlinedInput
                        label="phoneNumber"
                        {...register("phoneNumber")}
                        defaultValue="85997508822"
                      />
                      <Button variant="contained" type="submit">
                        Submit
                      </Button>
                    </form>
                  </Box>
                </Modal>
              </div>
            </>
          )}
        </Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox color="primary" />
                  </TableCell>
                  <TableCell>Nome</TableCell>
                  <TableCell align="center">Nome de Usuário</TableCell>
                  <TableCell align="center">Número</TableCell>
                  <TableCell></TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contacts?.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox color="primary" />
                    </TableCell>

                    {edit && indexes === index ? (
                      <>
                        <TableCell component="th" scope="row">
                          <Form>
                            <InputLabel>Nome</InputLabel>
                            <OutlinedInput
                              label="Nome"
                              {...register("name")}
                              defaultValue={row.name}
                            />
                          </Form>
                        </TableCell>
                        <TableCell align="center">
                          <Form>
                            <InputLabel>Nome de Usuário</InputLabel>
                            <OutlinedInput
                              label="Nome de Usuário"
                              {...register("nickname")}
                              defaultValue={row.nickname}
                            />
                          </Form>
                        </TableCell>
                        <TableCell align="center">
                          <Form>
                            <InputLabel>Número de Contato</InputLabel>
                            <OutlinedInput
                              label="Número de Contato"
                              {...register("phoneNumber")}
                              defaultValue={row.phoneNumber}
                            />
                          </Form>
                        </TableCell>
                        <TableCell>
                          <input
                            style={{ display: "none" }}
                            defaultValue={row.uuid}
                            {...register("uuid")}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <>
                            <IconButton type="submit">
                              <Done />
                            </IconButton>
                            <IconButton
                              onClick={() => {
                                setEdit(false);
                              }}
                            >
                              <Close />
                            </IconButton>
                          </>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell component="th" scope="row">
                          {row.name}
                        </TableCell>
                        <TableCell align="center">{row.nickname}</TableCell>
                        <TableCell align="center">{row.phoneNumber}</TableCell>
                        <TableCell></TableCell>
                        <TableCell align="right">
                          <IconButton
                            onClick={(event) => handleClick(event, index)}
                          >
                            <MoreVert />
                          </IconButton>
                          <Menu
                            key={index}
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                              "aria-labelledby": "basic-button",
                            }}
                          >
                            <MenuItem onClick={handleEdit}>Editar</MenuItem>
                            <MenuItem onClick={handleDelete}>Deletar</MenuItem>
                          </Menu>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </form>
      </FormContainer>
    </Container>
  );
}
