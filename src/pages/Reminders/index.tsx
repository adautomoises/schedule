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
  datePicker: dayjs.Dayjs | null | undefined;
  timePicker: dayjs.Dayjs | null | undefined;
}

interface UserNotes {
  color: "#f9361b" | "#f87c1c" | "#fac91c" | "#5ccdb8" | "#2caef6" | "#6462fc";
  date: Date;
  description: string;
  taskNotes: {
    description: string;
    status: string;
    uuid: string;
  }[];
  time: dayjs.Dayjs | null | undefined;
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
  datePicker: yup
    .date()
    .nullable()
    .default(undefined)
    .typeError("Data de aniversário inválida!"),
  timePicker: yup
    .date()
    .nullable()
    .default(undefined)
    .typeError("Horário inválido!"),
});

function Reminders() {
  const scheduleUUID = localStorage.getItem(
    "@schedule:user-schedule-uuid-1.0.0"
  );
  const [userNotes, setUserNotes] = useState<UserNotes[]>();

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
    setSelectedColor("#f9361b");
    reset();
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
    updateTask();
    reset();
  };

  const createNewNote = (data: IFormInputs) => {
    let request = {
      color: selectedColor,
      date: dayjs(data.datePicker).format("YYYY-MM-DD"),
      description: data.description,
      title: data.title,
      time: dayjs(data.timePicker).format("HH:mm"),
    };

    api
      .post(`/notes`, request, {
        params: {
          scheduleUUID: scheduleUUID,
        },
      })
      .then((response) => {
        setUserNotes((userNotes) => [userNotes, response.data]);
        handleCloseModalNewNote();
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
        setValue("title", "");
        handleUpdateTaskNotes(response.data);
        console.log(response.data);
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
        console.log(response.data);
      })
      .catch((error: AxiosError<IErrorResponse>) => {
        if (error.response) {
          console.log(error.response.data.message);
        }
      });
  };

  const updateTask = () => {
    if (isChange) {
      let request: TaskProps[] = [];

      selectedItem?.taskNotes?.forEach((task: TaskProps) => {
        request.push(task);
      });

      api
        .patch("/notes/taskNotes", request)
        .then((response) => {
          console.log(response.data);
        })
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

  const handleChangeTaskStatus = (task: TaskProps) => {
    task.status = task.status === "COMPLETE" ? "NOT_COMPLETE" : "COMPLETE";
    setSelectedItem((prevState = {} as UserNotes) => ({
      ...prevState,
      taskNotes: prevState.taskNotes.map((t) =>
        t.uuid === task.uuid ? { ...t, status: task.status } : t
      ),
    }));
  };

  const handleUpdateTaskNotes = (task: TaskProps) => {
    setSelectedItem((prevState = {} as UserNotes) => ({
      ...prevState,
      taskNotes: [...(prevState.taskNotes || []), task],
    }));
  };

  const [isChange, setIsChange] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState("#f9361b");

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

  const [valueDatePicker, setValueDatePicker] = useState<
    dayjs.Dayjs | null | undefined
  >(null);
  const [valueTimePicker, setValueTimePicker] = useState<
    dayjs.Dayjs | null | undefined
  >(null);

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
                      {...controlProps("#f9361b")}
                      sx={{
                        color: "#f9361b",
                        "&.Mui-checked": {
                          color: "#f9361b",
                        },
                      }}
                    />
                    <Radio
                      {...controlProps("#f87c1c")}
                      sx={{
                        color: "#f87c1c",
                        "&.Mui-checked": {
                          color: "#f87c1c",
                        },
                      }}
                    />
                    <Radio
                      {...controlProps("#fac91c")}
                      sx={{
                        color: "#fac91c",
                        "&.Mui-checked": {
                          color: "#fac91c",
                        },
                      }}
                    />
                    <Radio
                      {...controlProps("#5ccdb8")}
                      sx={{
                        color: "#5ccdb8",
                        "&.Mui-checked": {
                          color: "#5ccdb8",
                        },
                      }}
                    />
                    <Radio
                      {...controlProps("#2caef6")}
                      sx={{
                        color: "#2caef6",
                        "&.Mui-checked": {
                          color: "#2caef6",
                        },
                      }}
                    />
                    <Radio
                      {...controlProps("#6462fc")}
                      sx={{
                        color: "#6462fc",
                        "&.Mui-checked": {
                          color: "#6462fc",
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
              backgroundColor: `${item.color}`,
              color: "white",
            }}
          >
            <CardContent>
              <Typography sx={{ fontSize: 14 }} color="white" gutterBottom>
                {dayjs(item.date).format("DD/MM/YYYY")}
              </Typography>
              <Typography variant="h5" component="div" sx={styleNote}>
                {item.title}
              </Typography>
              {item.taskNotes && item.taskNotes[index] && (
                <Typography sx={{ mb: 1.5 }} color="white">
                  Itens{" "}
                  {
                    item.taskNotes.filter((task) => task.status === "COMPLETE")
                      .length
                  }{" "}
                  / {item.taskNotes.length}
                </Typography>
              )}
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
                    handleChangeTaskStatus(task);
                  }}
                />
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
