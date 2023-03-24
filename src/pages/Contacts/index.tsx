import { useEffect, useState } from "react";
import api from "../../services/api";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { AxiosError } from "axios";

import { Checkbox, IconButton, Menu, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, OutlinedInput, InputLabel, FormControl, styled, FormControlProps, Modal, Button, Box, Alert, FormHelperText, Pagination, } from "@mui/material";
import { Close, Delete, Done, MoreVert, Search, Add, } from "@mui/icons-material";
import { Container, FormContainer, Header } from "./styles";
import "../../styles.css";

interface IErrorResponse {
  message: string;
}

interface IFormInputs {
  name: string;
  nickname: string;
  phoneNumber: number;
  uuid: string;
}

interface ContactsProps {
  contacts: IFormInputs[];
  page: number;
  size: number;
  totalPages: number;
  totalContacts: number;
}

const schema = yup.object().shape({
  name: yup.string().required("Nome é obrigatório!"),
  nickname: yup.string().required("Nome de Usuário é obrigatório!"),
  phoneNumber: yup
    .string()
    .matches(/^\d+$/, "Número de Contato inválido. (Exemplo: (00) 0 0000-0000)")
    .required("Número de Contato é obrigatório!"),
});

export function Contacts() {
  const scheduleUUID = localStorage.getItem(
    "@schedule:user-schedule-uuid-1.0.0"
  );

  const { register, handleSubmit, reset, formState: { errors } } = useForm<IFormInputs>({ resolver: yupResolver(schema) });

  const [contacts, setContacts] = useState<ContactsProps>({} as ContactsProps);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentPagination, setCurrentPagination] = useState(1);
  const [indexes, setIndexes] = useState<number | null>(null);
  const [edit, setEdit] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [checkedAll, setCheckedAll] = useState(false);
  const [includesArray, setIncludesArray] = useState([] as number[]);

  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => { setOpenModal(false); reset(); };

  const [alertSuccess, setAlertSuccess] = useState("");
  const [alertError, setAlertError] = useState("");
  const [alertErrorModal, setAlertErrorModal] = useState("");

  const newContact = (data: IFormInputs) => {
    setAlertErrorModal("");

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
        if (contacts.contacts.length < 5) {
          const Contacts = [...contacts.contacts];
          Contacts.push(response.data)
          setContacts({ ...contacts, contacts: Contacts })
        } else {
          if (contacts.totalContacts % 5 === 0) {
            setCurrentPage(contacts.totalPages);
            setCurrentPagination(contacts.totalPages + 1);
          } else if (contacts.totalContacts % 5 !== 0) {
            setCurrentPage(contacts.totalPages - 1);
            setCurrentPagination(contacts.totalPages);
          }
        }
        handleCloseModal();
        setAlertSuccess(
          response.data.nickname + " foi adicionado com sucesso!"
        );
        setTimeout(() => {
          setAlertSuccess("");
        }, 3000);
      })
      .catch((error: AxiosError<IErrorResponse>) => {
        if (error.response) {
          setAlertErrorModal(error.response.data.message);
        }
      });
  };
  const patchContact = (data: IFormInputs) => {
    setAlertError("");

    let request = {
      name: data.name,
      nickname: data.nickname,
      phoneNumber: data.phoneNumber,
    };

    api
      .patch(`/contacts`, request, {
        params: {
          scheduleUUID: scheduleUUID,
          contactUUID: data.uuid,
        },
      })
      .then((response) => {
        const Contacts = [...contacts.contacts];
        setContacts({
          ...contacts, contacts: Contacts.map((contact) => {
            if (contact.uuid === response.data.uuid) {
              contact = response.data;
            }
            return contact;
          })
        })
        setEdit(false);
        setAlertSuccess(response.data.nickname + " atualizado com sucesso!");
        setTimeout(() => {
          setAlertSuccess("");
        }, 3000);
      })
      .catch((error: AxiosError<IErrorResponse>) => {
        if (error.response) {
          setAlertError(error.response.data.message);
        }
      });
  };
  const deleteContact = () => {
    if (contacts.contacts && indexes !== null && contacts.contacts[indexes].uuid) {
      api
        .delete(`/contacts`, {
          params: {
            uuid: contacts.contacts[indexes].uuid,
          },
        })
        .then((response) => {
          const Contacts = [...contacts.contacts];
          setContacts({ ...contacts, contacts: Contacts.filter((contact) => contact.uuid !== contacts.contacts[indexes].uuid) })
          setCurrentPage(0);
          setCurrentPagination(1);

          setAlertSuccess(response.data.message);
          setTimeout(() => {
            setAlertSuccess("");
          }, 3000);
          setIncludesArray([]);
        })
        .catch((error: AxiosError<IErrorResponse>) => {
          if (error.response) {
            setAlertError(error.response.data.message);
          }
        });
    }

    handleClose();
  };
  const manyDeleteContact = () => {
    let request: string[] = [];

    contacts.contacts?.forEach((contact, index) => {
      if (includesArray.includes(index)) {
        request.push(contact.uuid);
      }
    });
    api
      .delete(`/contacts/manyDeleted`, {
        data: request,
      })
      .then((response) => {
        const Contacts = [...contacts.contacts];
        setContacts({
          ...contacts, contacts:
            Contacts.filter(item => !request.includes(item.uuid))
        })
        setAlertSuccess(response.data.message);
        setTimeout(() => {
          setAlertSuccess("");
        }, 3000);
        setIncludesArray([]);
        setCheckedAll(false);
      })
      .catch((error: AxiosError<IErrorResponse>) => {
        if (error.response) {
          setAlertError(error.response.data.message);
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
      contacts.contacts?.forEach((_, index) => {
        if (!includesArray.includes(index)) {
          setIncludesArray((prevState) => [...prevState, index]);
        }
      });
    }
  };

  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setEdit(false);
    setIncludesArray([]);
    if (value > currentPage) {
      setCurrentPage(value - 1);
      setCurrentPagination(value);
    } else if (value <= currentPage) {
      setCurrentPage(value - 1);
      setCurrentPagination(value);
    } else {
      setCurrentPagination(value);
    }
  };

  useEffect(() => {
    setAlertError("");
    api
      .get(`/contacts/paged`, {
        params: {
          scheduleUUID: scheduleUUID,
          size: 5,
          page: currentPage,
          sort: 'name',
          order: 'asc'
        },
      })
      .then((response) => {
        setContacts(response.data);
      })
      .catch((error: AxiosError<IErrorResponse>) => {
        if (error.response) {
          setAlertError(error.response.data.message);
        }
      });
  }, [scheduleUUID, currentPage, contacts.totalContacts]);

  return (
    <Container>
      <FormContainer>
        {alertError !== "" && (
          <Alert severity="error">
            <div>{alertError}</div>
          </Alert>
        )}
        {alertSuccess !== "" && (
          <Alert severity="success">
            <div>{alertSuccess}</div>
          </Alert>
        )}
        <Header>
          {includesArray.length > 0 ||
            (checkedAll && includesArray.length > 0) ? (
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
                        <InputLabel>Nome*</InputLabel>
                        <OutlinedInput
                          label="Nome*"
                          placeholder="Nome"
                          {...register("name")}
                        />
                        <FormHelperText>{errors.name?.message}</FormHelperText>
                      </FormControl>
                      <FormControl>
                        <InputLabel>Nome de Usuário*</InputLabel>
                        <OutlinedInput
                          label="Nome de Usuário*"
                          placeholder="Nome de Usuário"
                          {...register("nickname")}
                        />
                        <FormHelperText>
                          {errors.nickname?.message}
                        </FormHelperText>
                      </FormControl>
                      <FormControl>
                        <InputLabel>Número de Contato*</InputLabel>
                        <OutlinedInput
                          label="Número de Contato*"
                          placeholder="(00) 0 0000-0000"
                          {...register("phoneNumber")}
                          type="number"
                        />
                        <FormHelperText>
                          {errors.phoneNumber?.message}
                        </FormHelperText>
                      </FormControl>
                      <Button variant="contained" type="submit">
                        Criar
                      </Button>
                      {alertErrorModal !== "" && (
                        <Alert severity="error">
                          <div>{alertErrorModal}</div>
                        </Alert>
                      )}
                    </Box>
                  </form>
                </Modal>
              </div>
            </>
          )}
        </Header>
        <form onSubmit={handleSubmit(patchContact)}>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
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
                {contacts.contacts?.map((row, index) => (
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
                            <FormHelperText>
                              {errors.name?.message}
                            </FormHelperText>
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
                            <FormHelperText>
                              {errors.nickname?.message}
                            </FormHelperText>
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
                            <FormHelperText>
                              {errors.phoneNumber?.message}
                            </FormHelperText>
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
        <div className="center"
          style={{ width: "100%", margin: "10px 0" }}>

          <Pagination shape="rounded" count={contacts.totalPages} page={currentPagination} siblingCount={0} onChange={handleChangePage} />
        </div>
      </FormContainer>
    </Container>
  );
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
  borderRadius: 1,
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 1,
};