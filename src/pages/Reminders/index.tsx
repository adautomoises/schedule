import React from "react";

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
  InputAdornment,
  Radio,
  FormHelperText,
  TextField,
  Alert,
} from "@mui/material";

import { AxiosError } from "axios";

import { useEffect, useState } from "react";
import api from "../../services/api";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Container, Header, Cards } from "./styles";
import { Add, Cancel, Delete, Done } from "@mui/icons-material";

import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";

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
const styleTasks = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 1,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 1,
  justifyContent: "center",
  alignItems: "center",
};
const styleNote = {
  width: "100%",
  overflowWrap: "break-word",
  wordWrap: "break-word",
  wordBreak: "break-word",
};

interface IErrorResponse {
  message: string;
}

interface IFormInputs {
  color: string;
  description: string;
  title: string;
  status: string;
  datePicker: dayjs.Dayjs | null;
  timePicker: dayjs.Dayjs | null;
}

enum NotesColors {
  RED = "#f9361b",
  ORANGE = "#f87c1c",
  YELLOW = "#fac91c",
  CYAN = "#5ccdb8",
  BLUE = "#2caef6",
  PURPLE = "#6462fc",
}

interface UserNotes {
  color: "RED" | "ORANGE" | "YELLOW" | "CYAN" | "BLUE" | "PURPLE";
  date: Date | null;
  description: string;
  taskNotes: TaskProps[];
  time: dayjs.Dayjs | null;
  title: string;
  uuid: string;
}

interface TaskProps {
  description: string;
  status: string;
  uuid: string;
}

const schema = yup.object().shape({
  title: yup
    .string()
    .max(40, "Máximo de 40 caracteres")
    .required("Título Obrigatório*"),
  description: yup.string().max(200, "Máximo de 200 caracteres"),
  datePicker: yup.date().nullable().typeError("Data inválida!"),
  timePicker: yup.date().nullable().typeError("Horário inválido!"),
});

function Reminders() {
  const scheduleUUID = localStorage.getItem(
    "@schedule:user-schedule-uuid-1.0.0"
  );
  const [userNotes, setUserNotes] = useState<UserNotes[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
  });

  const [openModalNewNote, setOpenModalNewNote] = useState(false);
  const handleOpenModalNewNote = () => setOpenModalNewNote(true);
  const handleCloseModalNewNote = () => {
    setOpenModalNewNote(false);
    setValueDatePicker(null);
    setValueTimePicker(null);
    setTitle("");
    setDescription("");
    setSelectedColor("RED");
    reset();
  };

  const [NewTask, setNewTask] = useState<boolean>(false);

  const [alertNote, setAlertNote] = useState("");
  const [alertTask, setAlertTask] = useState("");

  const [selectedItem, setSelectedItem] = useState<UserNotes>({} as UserNotes);
  const [openModalViewNote, setOpenModalViewNote] = useState(false);
  const handleOpenModalViewNote = (item: UserNotes) => {
    setSelectedItem(item);
    setOpenModalViewNote(true);
  };
  const handleCloseModalViewNote = () => {
    setOpenModalViewNote(false);
    patchTasks();
    reset();
  };

  const [isChange, setIsChange] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState("RED");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedColor(event.target.value);
  };

  const controlProps = (item: string) => ({
    checked: selectedColor === item,
    onChange: handleChange,
    value: item,
    name: "color-radio-button-demo",
    inputProps: { "aria-label": item },
  });

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

  const [valueDatePicker, setValueDatePicker] = useState<dayjs.Dayjs | null>(
    null
  );
  const [valueTimePicker, setValueTimePicker] = useState<dayjs.Dayjs | null>(
    null
  );

  const noteColor = (Color: string) => {
    switch (Color) {
      case "BLUE":
        return NotesColors.BLUE;
      case "CYAN":
        return NotesColors.CYAN;
      case "ORANGE":
        return NotesColors.ORANGE;
      case "PURPLE":
        return NotesColors.PURPLE;
      case "RED":
        return NotesColors.RED;
      case "YELLOW":
        return NotesColors.YELLOW;
    }
  };

  const handleCreateNote = (data: IFormInputs) => {
    let request = {
      color: selectedColor,
      date: data.datePicker
        ? dayjs(data.datePicker).format("YYYY-MM-DD")
        : null,
      description: data.description,
      title: data.title,
      time: data.timePicker ? dayjs(data.timePicker).format("HH:mm") : null,
    };

    api
      .post(`/notes`, request, {
        params: {
          scheduleUUID: scheduleUUID,
        },
      })
      .then((response) => {
        setUserNotes((prevState) => [...prevState, response.data]);
        handleCloseModalNewNote();
        setAlertNote("Nota criada com sucesso!");
        setTimeout(() => {
          setAlertNote("");
        }, 3000);
      })
      .catch((error: AxiosError<IErrorResponse>) => {
        if (error.response) {
          console.log(error.response.data.message);
        }
      });
  };

  const handleDeleteNote = () => {
    api
      .delete(`/notes`, {
        params: {
          uuid: selectedItem.uuid,
        },
      })
      .then((response) => {
        setUserNotes((prevState) =>
          prevState.filter((note) => note.uuid !== selectedItem.uuid)
        );
        handleCloseModalViewNote();
        setAlertNote(response.data.message);
        setTimeout(() => {
          setAlertNote("");
        }, 3000);
      })
      .catch((error: AxiosError<IErrorResponse>) => {
        if (error.response) {
          console.log(error.response.data.message);
        }
      });
  };

  const handleCreateTask = (data: IFormInputs) => {
    let request = {
      description: data.description,
      status: "NOT_COMPLETE",
    };

    api
      .post("/notes/taskNotes", request, {
        params: {
          noteUUID: selectedItem.uuid,
        },
      })
      .then((response) => {
        console.log(response.data);
        const Notes = [...userNotes];
        const Note = Notes.find((note) => note.uuid === selectedItem.uuid);
        if (Note?.taskNotes === null) {
          Note.taskNotes = [];
          Note?.taskNotes.push(response.data);
        } else {
          Note?.taskNotes.push(response.data);
        }
        setUserNotes(Notes);
        reset();
        setAlertTask("Tarefa criada com sucesso!");
        setTimeout(() => {
          setAlertTask("");
        }, 3000);
      })
      .catch((error: AxiosError<IErrorResponse>) => {
        if (error.response) {
          console.log(error.response.data.message);
        }
      });
  };

  const handleDeleteTask = (Task: TaskProps) => {
    api
      .delete("/notes/taskNotes", {
        params: {
          taskUUID: Task.uuid,
        },
      })
      .then((response) => {
        const Notes = [...userNotes];
        const Note = Notes.find((note) => note.uuid === selectedItem.uuid);
        if (Note) {
          Note.taskNotes = Note.taskNotes.filter((task) => task !== Task);
          setUserNotes(Notes);
        }
        setAlertTask(response.data.message);
        setTimeout(() => {
          setAlertTask("");
        }, 3000);
      })
      .catch((error: AxiosError<IErrorResponse>) => {
        if (error.response) {
          console.log(error.response.data.message);
        }
      });
  };

  const handleUpdateTask = (Task: TaskProps) => {
    const Notes = [...userNotes];
    const Note = Notes.find((note) => note.uuid === selectedItem.uuid);
    if (Note) {
      const index = Note.taskNotes.indexOf(Task);
      if (index !== -1) {
        Note.taskNotes[index].status =
          Note.taskNotes[index].status === "NOT_COMPLETE"
            ? "COMPLETE"
            : "NOT_COMPLETE";
        setUserNotes(Notes);
      }
    }
  };

  const patchTasks = () => {
    if (isChange) {
      let request: TaskProps[] = [];

      selectedItem?.taskNotes?.forEach((task: TaskProps) => {
        request.push(task);
      });

      api
        .patch("/notes/taskNotes", request)
        .catch((error: AxiosError<IErrorResponse>) => {
          if (error.response) {
            console.log(error.response.data.message);
          }
        })
        .finally(() => {
          setIsChange(false);
        });
    }
  };

  return (
    <Container>
      <Header>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <IconButton onClick={handleOpenModalNewNote}>
            <Add />
          </IconButton>
          {alertNote !== "" && (
            <Alert severity="success">
              <div>{alertNote}</div>
            </Alert>
          )}
          <Modal
            open={openModalNewNote}
            onClose={handleCloseModalNewNote}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <form onSubmit={handleSubmit(handleCreateNote)}>
              <Box sx={style}>
                <FormControl>
                  <InputLabel>Título*</InputLabel>
                  <OutlinedInput
                    label="Título*"
                    {...register("title")}
                    placeholder="Título"
                    endAdornment={
                      <InputAdornment position="end">
                        <span
                          style={{
                            color: `${title.length > 40 ? "red" : "gray"}`,
                          }}
                        >
                          {title.length}
                        </span>
                        /40
                      </InputAdornment>
                    }
                    onChange={(event) => {
                      setTitle(event.target.value);
                    }}
                  />
                  <FormHelperText>{errors.title?.message}</FormHelperText>
                </FormControl>
                <FormControl>
                  <InputLabel>Descrição</InputLabel>
                  <OutlinedInput
                    label="Descrição"
                    {...register("description")}
                    placeholder="Descrição"
                    endAdornment={
                      <InputAdornment position="end">
                        <span
                          style={{
                            color: `${
                              description.length > 200 ? "red" : "gray"
                            }`,
                          }}
                        >
                          {description.length}
                        </span>
                        /200
                      </InputAdornment>
                    }
                    onChange={(event) => {
                      setDescription(event.target.value);
                    }}
                  />
                  <FormHelperText>{errors.description?.message}</FormHelperText>
                </FormControl>
                <FormControl
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  <h2>Cor</h2>
                  <div>
                    <Radio
                      {...controlProps("RED")}
                      sx={{
                        color: NotesColors.RED,
                        "&.Mui-checked": {
                          color: NotesColors.RED,
                        },
                      }}
                    />
                    <Radio
                      {...controlProps("ORANGE")}
                      sx={{
                        color: NotesColors.ORANGE,
                        "&.Mui-checked": {
                          color: NotesColors.ORANGE,
                        },
                      }}
                    />
                    <Radio
                      {...controlProps("YELLOW")}
                      sx={{
                        color: NotesColors.YELLOW,
                        "&.Mui-checked": {
                          color: NotesColors.YELLOW,
                        },
                      }}
                    />
                    <Radio
                      {...controlProps("CYAN")}
                      sx={{
                        color: NotesColors.CYAN,
                        "&.Mui-checked": {
                          color: NotesColors.CYAN,
                        },
                      }}
                    />
                    <Radio
                      {...controlProps("BLUE")}
                      sx={{
                        color: NotesColors.BLUE,
                        "&.Mui-checked": {
                          color: NotesColors.BLUE,
                        },
                      }}
                    />
                    <Radio
                      {...controlProps("PURPLE")}
                      sx={{
                        color: NotesColors.PURPLE,
                        "&.Mui-checked": {
                          color: NotesColors.PURPLE,
                        },
                      }}
                    />
                  </div>
                </FormControl>
                <FormControl>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Data"
                      value={valueDatePicker}
                      inputFormat="DD-MM-YYYY"
                      onChange={(newValue) => {
                        setValueDatePicker(newValue);
                        setValue("datePicker", newValue);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                  <FormHelperText>{errors.datePicker?.message}</FormHelperText>
                </FormControl>
                <FormControl>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                      label="Horário"
                      value={valueTimePicker}
                      inputFormat="HH:mm"
                      onChange={(newValue) => {
                        setValueTimePicker(newValue);
                        setValue("timePicker", newValue);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                  {
                    <FormHelperText>
                      {errors?.timePicker?.message}
                    </FormHelperText>
                  }
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
              backgroundColor: `${noteColor(item.color)}`,
              color: "white",
            }}
          >
            <CardContent>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography sx={{ fontSize: 14 }} color="white" gutterBottom>
                  {item.date !== null && dayjs(item.date).format("DD/MM/YYYY")}
                </Typography>
                <Typography sx={{ fontSize: 14 }} color="white" gutterBottom>
                  {item.time !== null && <>{item.time}</>}
                </Typography>
                {item.taskNotes?.length > 0 && (
                  <Typography sx={{ fontSize: 14 }} color="white" gutterBottom>
                    Lista{" "}
                    {
                      item.taskNotes.filter(
                        (task) => task.status === "COMPLETE"
                      ).length
                    }{" "}
                    / {item.taskNotes.length}
                  </Typography>
                )}
              </div>

              <Typography variant="h6" component="div" sx={styleNote}>
                {item.title}
              </Typography>

              <Typography variant="body2" sx={styleNote}>
                {item.description}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="outlined"
                color="inherit"
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
          {alertTask !== "" && (
            <Alert severity="success">
              <div>{alertTask}</div>
            </Alert>
          )}
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{selectedItem?.title}</span>
            <Button variant="outlined" onClick={handleDeleteNote} color="error">
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
            <Button
              onClick={() => {
                setNewTask(true);
              }}
              style={{
                display: `${NewTask ? "none" : "flex"}`,
              }}
              color="primary"
              variant="outlined"
              startIcon={<Add />}
            >
              Adicionar item
            </Button>

            {NewTask && (
              <form
                onSubmit={handleSubmit(handleCreateTask)}
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
                    placeholder="Descrição"
                  />
                </FormControl>
                <IconButton
                  type="submit"
                  onClick={() => {
                    setValue("title", "Task");
                  }}
                >
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
          <div
            style={{
              width: "100%",
              maxHeight: "500px",
              display: "flex",
              flexDirection: "column",
              overflowY: "scroll",
            }}
          >
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
                  <Checkbox
                    checked={task.status === "COMPLETE"}
                    onClick={() => {
                      setIsChange(true);
                      handleUpdateTask(task);
                    }}
                  />
                  <IconButton
                    onClick={() => {
                      handleDeleteTask(task);
                    }}
                  >
                    <Delete color="error" />
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
        </Box>
      </Modal>
    </Container>
  );
}

export default Reminders;
