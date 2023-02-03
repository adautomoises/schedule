import {
  Card,
  Box,
  CardActions,
  CardContent,
  Button,
  Typography,
  OutlinedInput,
  IconButton,
  Modal,
  FormControl,
  InputLabel,
  Checkbox,
} from "@mui/material";

import { AxiosError } from "axios";

import { useEffect, useState } from "react";
import api from "../../services/api";
import { useForm } from "react-hook-form";

import { Container, Header, Cards } from "./styles";
import { Add, Cancel, Delete, Done } from "@mui/icons-material";

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
const styleTasks = {
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
  justifyContent: "center",
  alignItems: "center",
};

interface IErrorResponse {
  message: string;
}

interface IFormInputs {
  color: string;
  date: Date;
  description: string;
  title: string;
  status: string;
}

interface UserNotes {
  color: string;
  date: Date;
  description: string;
  taskNotes: {
    description: string;
    status: string;
    uuid: string;
  }[];
  time: {
    hour: 0;
    minute: 0;
    nano: 0;
    second: 0;
  };
  title: string;
  uuid: string;
}

interface TaskProps {
  description: string;
  status: string;
  uuid: string;
}

function Reminders() {
  const scheduleUUID = localStorage.getItem(
    "@schedule:user-schedule-uuid-1.0.0"
  );
  const [userNotes, setUserNotes] = useState<UserNotes[]>();

  const { register, handleSubmit, reset } = useForm<IFormInputs>();

  const [openModalNewNote, setOpenModalNewNote] = useState(false);
  const handleOpenModalNewNote = () => setOpenModalNewNote(true);
  const handleCloseModalNewNote = () => {
    reset();
    setOpenModalNewNote(false);
  };

  const [NewTask, setNewTask] = useState<boolean>(false);

  const [selectedItem, setSelectedItem] = useState<UserNotes>();
  const [openModalViewNote, setOpenModalViewNote] = useState(false);
  const handleOpenModalViewNote = (item: UserNotes) => {
    setSelectedItem(item);
    setOpenModalViewNote(true);
  };
  const handleCloseModalViewNote = () => {
    setOpenModalViewNote(false);
    reset();
  };

  const createNewNote = (data: IFormInputs) => {
    let request = {
      color: data.color,
      date: new Date(),
      description: data.description,
      title: data.title,
    };

    api
      .post(`/notes`, request, {
        params: {
          scheduleUUID: scheduleUUID,
        },
      })
      .then((response) => {
        console.log(response.data);
        handleCloseModalNewNote();
        window.location.reload();
      })
      .catch((error: AxiosError<IErrorResponse>) => {
        if (error.response) {
          console.log(error.response.data.message);
        }
      });
  };
  const deleteNote = () => {
    api
      .delete(`/notes`, {
        params: {
          uuid: selectedItem?.uuid,
        },
      })
      .then((response) => {
        handleCloseModalNewNote();
        window.location.reload();
      })
      .catch((error: AxiosError<IErrorResponse>) => {
        if (error.response) {
          console.log(error.response.data.message);
        }
      });
  };

  const createNewTask = (data: IFormInputs) => {
    let request = {
      description: data.description,
      status: "NOT_COMPLETE",
    };

    api
      .post("/notes/taskNotes", request, {
        params: {
          noteUUID: selectedItem?.uuid,
        },
      })
      .then((response) => {
        window.location.reload();
      })
      .catch((error: AxiosError<IErrorResponse>) => {
        if (error.response) {
          console.log(error.response.data.message);
        }
      });
  };

  const deleteTask = (taskUUID: string) => {
    api
      .delete("/notes/taskNotes", {
        params: {
          taskUUID: taskUUID,
        },
      })
      .then((response) => {
        window.location.reload();
      })
      .catch((error: AxiosError<IErrorResponse>) => {
        if (error.response) {
          console.log(error.response.data.message);
        }
      });
  };

  const updateTask = (task: TaskProps) => {
    let request = {
      status: `${task.status === "COMPLETE" ? "NOT_COMPLETE" : "COMPLETE"}`,
    };

    api
      .patch("/notes/taskNotes", request, {
        params: {
          taskUUID: task.uuid,
        },
      })
      .then((response) => {
        window.location.reload();
      })
      .catch((error: AxiosError<IErrorResponse>) => {
        if (error.response) {
          console.log(error.response.data.message);
        }
      });
  };

  useEffect(() => {
    api
      .get(`/notes`, {
        params: {
          scheduleUUID: scheduleUUID,
        },
      })
      .then((response) => {
        setUserNotes(response.data);
      })
      .catch((error: AxiosError<IErrorResponse>) => {
        if (error.response) {
          console.log(error.response.data.message);
        }
      });
  }, [scheduleUUID]);
  return (
    <Container>
      <Header>
        <div>
          <IconButton onClick={handleOpenModalNewNote}>
            <Add />
          </IconButton>
          <Modal
            open={openModalNewNote}
            onClose={handleCloseModalNewNote}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <form onSubmit={handleSubmit(createNewNote)}>
              <Box sx={style}>
                <FormControl>
                  <InputLabel>Cor</InputLabel>
                  <OutlinedInput
                    label="Cor"
                    {...register("color")}
                    placeholder="#ffffff"
                  />
                </FormControl>
                <FormControl>
                  <InputLabel>Data</InputLabel>
                  <OutlinedInput label="Data" {...register("date")} />
                </FormControl>
                <FormControl>
                  <InputLabel>Descrição</InputLabel>
                  <OutlinedInput
                    label="Descrição"
                    {...register("description")}
                    placeholder="Essa é uma descrição."
                  />
                </FormControl>
                <FormControl>
                  <InputLabel>Título</InputLabel>
                  <OutlinedInput
                    label="Título"
                    {...register("title")}
                    placeholder="Esse é o Título."
                  />
                </FormControl>
                <Button variant="contained" type="submit">
                  Submit
                </Button>
              </Box>
            </form>
          </Modal>
        </div>
      </Header>
      <Cards>
        {userNotes?.map((item, index) => (
          <Card
            key={index}
            sx={{
              minWidth: 275,
              maxWidth: "auto",
              backgroundColor: `${item.color}`,
            }}
          >
            <CardContent>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                {item.date.toString()}
              </Typography>
              <Typography variant="h5" component="div">
                {item.title}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                {item.color}
              </Typography>
              <Typography variant="body2">{item.description}</Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                onClick={() => handleOpenModalViewNote(item)}
              >
                Ver mais
              </Button>
            </CardActions>
          </Card>
        ))}
      </Cards>
      <Modal
        open={openModalViewNote}
        onClose={handleCloseModalViewNote}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleTasks}>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{selectedItem?.title}</span>
            <Button variant="outlined" onClick={deleteNote} color="error">
              Remover Nota
            </Button>
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "5rem",
            }}
          >
            <IconButton
              onClick={() => {
                setNewTask(true);
              }}
              style={{
                display: `${NewTask ? "none" : "flex"}`,
              }}
              color="primary"
            >
              <Add />
            </IconButton>

            {NewTask && (
              <form
                onSubmit={handleSubmit(createNewTask)}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <FormControl>
                  <InputLabel>Item</InputLabel>
                  <OutlinedInput
                    label="Item"
                    {...register("description")}
                    placeholder="Essa é uma descrição."
                  />
                </FormControl>
                <IconButton type="submit">
                  <Done color="success" />
                </IconButton>
                <IconButton
                  onClick={() => {
                    setNewTask(false);
                  }}
                >
                  <Cancel color="error" />
                </IconButton>
              </form>
            )}
          </div>
          {selectedItem?.taskNotes?.map((task, index) => (
            <div
              key={index}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>{task.description}</span>
              <div>
                {task.status === "COMPLETE" ? (
                  <Checkbox
                    checked={true}
                    onClick={() => {
                      updateTask(task);
                    }}
                  />
                ) : (
                  <Checkbox
                    checked={false}
                    onClick={() => {
                      updateTask(task);
                    }}
                  />
                )}
                <IconButton
                  onClick={() => {
                    deleteTask(task.uuid);
                  }}
                >
                  <Delete color="error" />
                </IconButton>
              </div>
            </div>
          ))}
        </Box>
      </Modal>
    </Container>
  );
}

export default Reminders;
