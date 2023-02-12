import {
  Alert,
  Box,
  Button,
  Collapse,
  FormControl,
  FormHelperText,
  IconButton,
  IconButtonProps,
  InputLabel,
  OutlinedInput,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import {
  Delete,
  ExpandMore as ExpandMoreIcon,
  Visibility,
} from "@mui/icons-material";

import { AxiosError } from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from "../../services/api";
import { Container, FormContainer, Header } from "./styles";
import React from "react";
import { useNavigate } from "react-router-dom";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

interface IErrorResponse {
  message: string;
}

interface FriendList {
  friendsResponse: Friend[];
  totalFriends: number;
}

interface Friend {
  birthDate: Date;
  email: string;
  fullName: string;
  genre: "Não-Binário" | "Masculino" | "Feminino";
  nickName: string;
  scheduleUUID: string;
  uuid: string;
}

interface IFormInputs {
  friend: string;
}

export function Friends() {
  const navigate = useNavigate();
  const userUUID = localStorage.getItem("@schedule:user-uuid-1.0.0");
  const [friendList, setFriendList] = useState<FriendList>({} as FriendList);
  const [alertError, setAlertError] = useState("");
  const [alertSuccess, setAlertSuccess] = useState("");

  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  const handleExpandClick = (index: number) => {
    if (expandedRows.includes(index)) {
      setExpandedRows(expandedRows.filter((i) => i !== index));
    } else {
      setExpandedRows([...expandedRows, index]);
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormInputs>();

  useEffect(() => {
    api
      .get(`/users/getFriendsUser`, {
        params: {
          userUUID: userUUID,
        },
      })
      .then((response) => {
        setFriendList(response.data);
      })
      .catch((error: AxiosError<IErrorResponse>) => {
        if (error.response) {
          setAlertError(error.response.data.message);
        }
      });
  }, [userUUID]);

  const handleAddFriend = (data: IFormInputs) => {
    setAlertError("");

    api
      .get(`/users/addFriend`, {
        params: {
          userUUID: userUUID,
          friendNickName: data.friend,
        },
      })
      .then((response) => {
        const FriendList = [...friendList.friendsResponse];
        FriendList.push(response.data);
        setFriendList({
          friendsResponse: FriendList,
          totalFriends: friendList.totalFriends + 1,
        });
        setAlertSuccess(data.friend + " adicionado com sucesso!");
        setTimeout(() => {
          setAlertSuccess("");
        }, 3000);
      })
      .catch((error: AxiosError<IErrorResponse>) => {
        if (error.response) {
          setAlertError(error.response.data.message);
        }
      })
      .finally(reset);
  };

  const handleRemoveFriend = (Friend: Friend) => {
    setAlertError("");

    api
      .delete(`/users/deleteFriend`, {
        params: {
          userUUID: userUUID,
          friendNickName: Friend.nickName,
        },
      })
      .then(() => {
        const FriendList = [...friendList.friendsResponse];
        setFriendList({
          friendsResponse: FriendList.filter(
            (friend) => friend.uuid !== Friend.uuid
          ),
          totalFriends: friendList.totalFriends - 1,
        });
        setAlertSuccess(Friend.nickName + " removido com sucesso!");
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

  const handleViewProfile = (Friend: Friend) => {
    navigate(`/perfil/${Friend.nickName}`);
  };

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
          <form onSubmit={handleSubmit(handleAddFriend)}>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "2rem",
              }}
            >
              <FormControl>
                <InputLabel>Nome de Usuário</InputLabel>
                <OutlinedInput
                  label="Nome de Usuário"
                  placeholder="Nome de Usuário"
                  {...register("friend")}
                />
                <FormHelperText>{errors.friend?.message}</FormHelperText>
              </FormControl>
              <Button type="submit" variant="contained" color="primary">
                Adicionar
              </Button>
            </div>
          </form>
        </Header>
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell component="th" scope="row">
                  Nome Completo
                </TableCell>
                <TableCell align="right" sx={{ width: "200px" }}>
                  Nome de Usuário
                </TableCell>
                <TableCell sx={{ width: "200px" }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {friendList.friendsResponse?.map((friend, index) => (
                <React.Fragment key={index}>
                  <TableRow>
                    <TableCell style={{ padding: 0 }} align="center">
                      <ExpandMore
                        expand={expandedRows.includes(index)}
                        onClick={() => handleExpandClick(index)}
                        aria-expanded={expandedRows.includes(index)}
                        aria-label="show more"
                      >
                        <ExpandMoreIcon />
                      </ExpandMore>
                    </TableCell>
                    <TableCell>{friend.fullName}</TableCell>
                    <TableCell align="right" sx={{ width: "200px" }}>
                      {friend.nickName}
                    </TableCell>
                    <TableCell align="right" sx={{ width: "200px" }}>
                      <IconButton onClick={() => handleViewProfile(friend)}>
                        <Visibility color="primary" />
                      </IconButton>
                      <IconButton onClick={() => handleRemoveFriend(friend)}>
                        <Delete color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={6}
                    >
                      <Collapse
                        in={expandedRows.includes(index)}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box sx={{ margin: 2 }}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell component="th" scope="row">
                                  E-mail
                                </TableCell>
                                <TableCell
                                  align="right"
                                  sx={{ width: "200px" }}
                                >
                                  Data de Aniversário
                                </TableCell>
                                <TableCell
                                  align="right"
                                  sx={{ width: "200px" }}
                                >
                                  Gênero
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                <TableCell component="th" scope="row">
                                  {friend.email}
                                </TableCell>
                                <TableCell
                                  align="right"
                                  sx={{ width: "200px" }}
                                >
                                  {dayjs(friend.birthDate).format("DD/MM/YYYY")}
                                </TableCell>
                                <TableCell
                                  align="right"
                                  sx={{ width: "200px" }}
                                >
                                  {friend.genre}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </FormContainer>
    </Container>
  );
}
