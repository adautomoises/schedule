import { useEffect, useState } from "react";
import api from "../../services/api";
import { useForm } from "react-hook-form";
import { AxiosError } from "axios";

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
  Alert,
  Collapse,
} from "@mui/material";
import {
  Close,
  Delete,
  Done,
  MoreVert,
  Search,
  Add,
} from "@mui/icons-material";

import { Container, FormContainer, Header } from "./styles";

interface IFormInputs {
  uuid: string;
  name: string;
  nickname: string;
  phoneNumber: number;
}

const Form = styled(FormControl)<FormControlProps>({
  width: 150,
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
  display: "flex",
  flexDirection: "column",
  gap: 1,
};

interface IErrorResponse {
  message: string;
}

export function Contacts() {
  const scheduleUUID = localStorage.getItem(
    "@schedule:user-schedule-uuid-1.0.0"
  );

  const [openAlertNewContact, setOpenAlertNewContact] = useState(false);
  const [alertMessageNewContact, setAlertMessageNewContact] = useState("");
  const [openAlertPatchContact, setOpenAlertPatchContact] = useState(false);
  const [alertMessagePatchContact, setAlertMessagePatchContact] = useState("");
  const [openAlertDeleteContact, setOpenAlertDeleteContact] = useState(false);
  const [alertMessageDeleteContact, setAlertMessageDeleteContact] =
    useState("");

  const [contacts, setContacts] = useState<IFormInputs[]>();
  const [indexes, setIndexes] = useState<number | null>(null);
  const [edit, setEdit] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { register, handleSubmit, reset } = useForm<IFormInputs>();

  const [checkedAll, setCheckedAll] = useState(false);
  const [includesArray, setIncludesArray] = useState([] as number[]);

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
      .then(() => {
        window.location.reload();
      })
      .catch((error: AxiosError<IErrorResponse>) => {
        setOpenAlertNewContact(true);
        if (error.response) {
          setAlertMessageNewContact(error.response.data.message);
        }
      });
  };
  const patchContact = (data: IFormInputs) => {
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
        setOpenAlertPatchContact(true);
        setAlertMessagePatchContact(response.data.message);
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      })
      .catch((error: AxiosError<IErrorResponse>) => {
        setOpenAlertPatchContact(true);
        if (error.response) {
          setAlertMessagePatchContact(error.response.data.message);
        }
      });
  };
  const deleteContact = () => {
    if (contacts && indexes !== null && contacts[indexes].uuid) {
      api
        .delete(`/contacts`, {
          params: {
            uuid: contacts[indexes].uuid,
          },
        })
        .then((response) => {
          setOpenAlertDeleteContact(true);
          setAlertMessageDeleteContact(response.data.message);
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        })
        .catch((error: AxiosError<IErrorResponse>) => {
          setOpenAlertDeleteContact(true);
          if (error.response) {
            setAlertMessageDeleteContact(error.response.data.message);
          }
        });
    }

    handleClose();
  };
  const manyDeleteContact = () => {
    let request: string[] = [];

    contacts?.forEach((_, index) => {
      if (includesArray.includes(index)) {
        request.push(_.uuid);
      }
    });

    api
      .delete(`/contacts/manyDeleted`, {
        data: request,
      })
      .then((response) => {
        setOpenAlertDeleteContact(true);
        setAlertMessageDeleteContact(response.data.message);
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      })
      .catch((error: AxiosError<IErrorResponse>) => {
        setOpenAlertDeleteContact(true);
        if (error.response) {
          setAlertMessageDeleteContact(error.response.data.message);
        }
      });
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

  const handleClickCheckbox = (index: number) => {
    if (checkedAll) {
      setCheckedAll(false);
    }
    if (includesArray.includes(index)) {
      setIncludesArray(includesArray.filter((item) => item !== index));
    } else {
      setIncludesArray([...includesArray, index]);
    }
  };
  const handleClickCheckboxAll = () => {
    setCheckedAll(!checkedAll);
    if (checkedAll && includesArray.length > 0) {
      setIncludesArray([]);
    } else if (!checkedAll) {
      contacts?.forEach((_, index) => {
        if (!includesArray.includes(index)) {
          setIncludesArray((prevState) => [...prevState, index]);
        }
      });
    }
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
  }, [scheduleUUID]);

  return (
    <Container>
      <FormContainer>
        <Collapse in={openAlertDeleteContact}>
          <Alert
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setOpenAlertDeleteContact(false);
                }}
              >
                <Close fontSize="inherit" />
              </IconButton>
            }
          >
            {alertMessageDeleteContact}
          </Alert>
        </Collapse>
        <Collapse in={openAlertPatchContact}>
          <Alert
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setOpenAlertPatchContact(false);
                }}
              >
                <Close fontSize="inherit" />
              </IconButton>
            }
          >
            {alertMessagePatchContact}
          </Alert>
        </Collapse>
        <Header>
          {checkedAll && includesArray.length > 0 ? (
            <>
              <div>
                {includesArray.length > 1 ? (
                  <span>{includesArray.length} contatos selecionados.</span>
                ) : (
                  <span>{includesArray.length} contato selecionado.</span>
                )}
              </div>
              <div>
                <IconButton onClick={manyDeleteContact}>
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
                  <form onSubmit={handleSubmit(newContact)}>
                    <Box sx={style}>
                      <FormControl>
                        <InputLabel>Nome</InputLabel>
                        <OutlinedInput
                          label="Nome"
                          {...register("name")}
                          defaultValue="Adauto Moisés"
                        />
                      </FormControl>
                      <FormControl>
                        <InputLabel>Nome de Usuário</InputLabel>
                        <OutlinedInput
                          label="Nome de Usuário"
                          {...register("nickname")}
                          defaultValue="moandleandro"
                        />
                      </FormControl>
                      <FormControl>
                        <InputLabel>Número de Contato</InputLabel>
                        <OutlinedInput
                          label="Número de Contato"
                          {...register("phoneNumber")}
                          defaultValue="85997508822"
                        />
                      </FormControl>
                      <Button variant="contained" type="submit">
                        Submit
                      </Button>
                      <Collapse in={openAlertNewContact}>
                        <Alert
                          severity="error"
                          action={
                            <IconButton
                              aria-label="close"
                              color="inherit"
                              size="small"
                              onClick={() => {
                                setOpenAlertNewContact(false);
                              }}
                            >
                              <Close fontSize="inherit" />
                            </IconButton>
                          }
                        >
                          {alertMessageNewContact}
                        </Alert>
                      </Collapse>
                    </Box>
                  </form>
                </Modal>
              </div>
            </>
          )}
        </Header>
        <form onSubmit={handleSubmit(patchContact)}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={checkedAll}
                      onChange={handleClickCheckboxAll}
                    />
                  </TableCell>
                  <TableCell>Nome</TableCell>
                  <TableCell align="left">Nome de Usuário</TableCell>
                  <TableCell align="left">Número</TableCell>
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
                      <Checkbox
                        color="primary"
                        checked={includesArray.includes(index)}
                        onChange={() => handleClickCheckbox(index)}
                      />
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
                        <TableCell align="left">
                          <Form>
                            <InputLabel>Nome de Usuário</InputLabel>
                            <OutlinedInput
                              label="Nome de Usuário"
                              {...register("nickname")}
                              defaultValue={row.nickname}
                            />
                          </Form>
                        </TableCell>
                        <TableCell align="left">
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
                        <TableCell align="left">{row.nickname}</TableCell>
                        <TableCell align="left">{row.phoneNumber}</TableCell>
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
                            <MenuItem onClick={deleteContact}>Deletar</MenuItem>
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
