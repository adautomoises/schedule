import React, { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
//Api
import api from "../../services/api";
//Date & Time
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
//utils
import { UserNotes, IFormInputs, IErrorResponse, TaskProps } from "../../interfaces/RemindersInterface";
import { NotesColors } from "../../enum/RemindersEnum";
//Styles
import "./styles.css"
import { Container, Header, Cards } from "./styles";
import { Add, Cancel, Delete, Done, Edit } from "@mui/icons-material";
import { Card, Box, CardActions, CardContent, Button, Typography, OutlinedInput, IconButton, Modal, FormControl, InputLabel, Checkbox, InputAdornment, Radio, FormHelperText, TextField, Alert } from "@mui/material";

const schema = yup.object().shape({ title: yup.string().max(40, "Máximo de 40 caracteres").required("Título Obrigatório*"), descriptionNotes: yup.string().max(200, "Máximo de 200 caracteres"), descriptionTasks: yup.string().max(50, "Máximo de 50 caracteres").required("Esse campo é obrigatório!"), datePicker: yup.date().nullable().typeError("Data inválida!"), timePicker: yup.date().nullable().typeError("Horário inválido!"), });

export function Reminders() {
  const scheduleUUID = localStorage.getItem("@schedule:user-schedule-uuid-1.0.0");
  const [userNotes, setUserNotes] = useState<UserNotes[]>([]);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<IFormInputs>({ resolver: yupResolver(schema), });

  const [openModalNewNote, setOpenModalNewNote] = useState(false);
  const handleOpenModalNewNote = () => setOpenModalNewNote(true);
  const handleCloseModalNewNote = () => { setOpenModalNewNote(false); setValueDatePicker(null); setValueTimePicker(null); setTitle(""); setDescriptionNotes(""); setSelectedColor("RED"); reset(); };

  const [NewTask, setNewTask] = useState<boolean>(false);

  const [alertSuccessNote, setAlertSuccessNote] = useState("");
  const [alertErrorNote, setAlertErrorNote] = useState("");
  const [alertSuccessTask, setAlertSuccessTask] = useState("");
  const [alertErrorTask, setAlertErrorTask] = useState("");

  const [selectedItem, setSelectedItem] = useState<UserNotes>({} as UserNotes);
  const [openModalViewNote, setOpenModalViewNote] = useState(false);
  const handleOpenModalViewNote = (item: UserNotes) => { setSelectedItem(item); setOpenModalViewNote(true); }; const handleCloseModalViewNote = () => { setOpenModalViewNote(false); setNewTask(false); patchTasks(); reset(); setEditNote(false); };
  const [isChange, setIsChange] = useState(false);

  const [title, setTitle] = useState("");
  const [descriptionNotes, setDescriptionNotes] = useState("");
  const [descriptionTasks, setDescriptionTasks] = useState("");
  const [selectedColor, setSelectedColor] = useState("RED");

  const noteColor = (Color: string) => {
    switch (Color) {
      case "BLUE": return NotesColors.BLUE;
      case "CYAN": return NotesColors.CYAN;
      case "ORANGE": return NotesColors.ORANGE;
      case "PURPLE": return NotesColors.PURPLE;
      case "RED": return NotesColors.RED;
      case "YELLOW": return NotesColors.YELLOW;
    }
  };

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

  useEffect(() => { api.get(`/notes`, { params: { scheduleUUID: scheduleUUID, }, }).then((response) => { setUserNotes(response.data); }).catch((error: AxiosError<IErrorResponse>) => { if (error.response) { setAlertErrorNote(error.response.data.message); } }); }, [scheduleUUID]);
  const [valueDatePicker, setValueDatePicker] = useState<dayjs.Dayjs | null>(null);
  const [valueTimePicker, setValueTimePicker] = useState<dayjs.Dayjs | null>(null);

  const [editNote, setEditNote] = useState(false);
  const handleClickEditNote = () => { setEditNote(!editNote); setSelectedColor(selectedItem.color); setDescriptionNotes(selectedItem.description); setTitle(selectedItem.title); setValue("descriptionTasks", ""); setValue("title", selectedItem.title); setNewTask(false); patchTasks(); }


  const handleCreateNote = (data: IFormInputs) => {
    setAlertErrorNote("");

    let request = {
      color: selectedColor,
      date: data.datePicker
        ? dayjs(data.datePicker).format("YYYY-MM-DD")
        : null,
      description: data.descriptionNotes,
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
        setAlertSuccessNote("Nota criada com sucesso!");
        setTimeout(() => {
          setAlertSuccessNote("");
        }, 3000);
      })
      .catch((error: AxiosError<IErrorResponse>) => {
        if (error.response) {
          setAlertErrorNote(error.response.data.message);
        }
      });
  };
  const handleDeleteNote = () => {
    setAlertErrorNote("");

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
        setAlertSuccessNote(response.data.message);
        setTimeout(() => {
          setAlertSuccessNote("");
        }, 3000);
      })
      .catch((error: AxiosError<IErrorResponse>) => {
        if (error.response) {
          setAlertErrorNote(error.response.data.message);
        }
      });
  };
  const handleUpdateNote = (data: IFormInputs) => {
    setAlertErrorNote("");

    let request = {
      color: selectedColor,
      description: data.descriptionNotes,
      title: data.title,
    };

    api
      .patch(`/notes`, request, {
        params: {
          uuid: selectedItem.uuid,
        },
      })
      .then((response) => {
        patchNotes(response.data);
        handleCloseModalViewNote();
        setAlertSuccessNote(response.data.title + " atualizado com sucesso!");
        setTimeout(() => {
          setAlertSuccessNote("");
        }, 3000);
      })
      .catch((error: AxiosError<IErrorResponse>) => {
        if (error.response) {
          setAlertErrorNote(error.response.data.message);
        }
      });
  };
  const patchNotes = (Note: UserNotes) => {
    const Notes = [...userNotes];
    const filteredNotes = Notes.filter((note) => note.uuid !== selectedItem.uuid)
    filteredNotes.push(Note);
    setUserNotes(filteredNotes);
  };

  const handleCreateTask = (data: IFormInputs) => {
    setAlertErrorTask("");

    let request = {
      description: data.descriptionTasks,
      status: "NOT_COMPLETE",
    };

    api
      .post("/notes/taskNotes", request, {
        params: {
          noteUUID: selectedItem.uuid,
        },
      })
      .then((response) => {
        const Notes = [...userNotes];
        const Note = Notes.find((note) => note.uuid === selectedItem.uuid);
        if (Note?.taskNotes === null) {
          Note.taskNotes = [];
          Note?.taskNotes.push(response.data);
        } else {
          Note?.taskNotes.push(response.data);
        }
        setUserNotes(Notes);
        setDescriptionTasks("");
        reset();
        setAlertSuccessTask("Tarefa criada com sucesso!");
        setTimeout(() => {
          setAlertSuccessTask("");
        }, 3000);
      })
      .catch((error: AxiosError<IErrorResponse>) => {
        if (error.response) {
          setAlertErrorTask(error.response.data.message);
        }
      })
      .finally(() => setNewTask(false));
  };
  const handleDeleteTask = (Task: TaskProps) => {
    setAlertErrorTask("");

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
        setAlertSuccessTask(response.data.message);
        setTimeout(() => {
          setAlertSuccessTask("");
        }, 3000);
      })
      .catch((error: AxiosError<IErrorResponse>) => {
        if (error.response) {
          setAlertErrorTask(error.response.data.message);
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
    setAlertErrorTask("");

    if (isChange) {
      let request: TaskProps[] = [];

      selectedItem?.taskNotes?.forEach((task: TaskProps) => {
        request.push(task);
      });

      api
        .patch("/notes/taskNotes", request)
        .catch((error: AxiosError<IErrorResponse>) => {
          if (error.response) {
            setAlertErrorTask(error.response.data.message);
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
        <div style={{ width: "100%", display: "flex", justifyContent: "space-around", alignItems: "center", flexDirection: "column", gap: 10, }}>
          <div style={{ width: "100%", }}>
            {alertErrorNote !== "" && (<Alert severity="error"><div>{alertErrorNote}</div></Alert>)} {alertSuccessNote !== "" && (<Alert severity="success"><div>{alertSuccessNote}</div></Alert>)}
          </div>
          <Button onClick={handleOpenModalNewNote} color="primary" variant="outlined" startIcon={<Add />}>Nota</Button>
          <Modal open={openModalNewNote} onClose={handleCloseModalNewNote} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
            <form onSubmit={handleSubmit(handleCreateNote)}>
              <Box sx={boxStyle} style={{ width: "400px", display: "flex", flexDirection: "column" }}>
                <FormControl>
                  <InputLabel>Título*</InputLabel>
                  <OutlinedInput
                    label="Título*"
                    {...register("title")}
                    placeholder="Título"
                    endAdornment={<InputAdornment position="end"><span style={{ color: `${title.length > 40 ? "red" : "gray"}`, }}>  {title.length}     </span>/40    </InputAdornment>}
                    onChange={(event) => { setTitle(event.target.value); }} />
                  <FormHelperText>{errors.title?.message}</FormHelperText>
                </FormControl>
                <FormControl>
                  <InputLabel>Descrição</InputLabel>
                  <OutlinedInput
                    label="Descrição"
                    {...register("descriptionNotes")}
                    placeholder="Descrição"
                    endAdornment={<InputAdornment position="end"><span style={{ color: `${descriptionNotes.length > 200 ? "red" : "gray"}`, }}>{descriptionNotes.length}</span>/200</InputAdornment>}
                    onChange={(event) => { setDescriptionNotes(event.target.value); }} />
                  <FormHelperText>{errors.descriptionNotes?.message}</FormHelperText>
                </FormControl>
                <FormControl style={{ display: "flex", justifyContent: "space-around", alignItems: "center", flexDirection: "row", }}>
                  <Typography color={"gray"}>Cor</Typography>
                  <div>
                    <Radio {...controlProps("RED")} sx={{ color: noteColor("RED"), "&.Mui-checked": { color: noteColor("RED"), }, }} />
                    <Radio {...controlProps("ORANGE")} sx={{ color: noteColor("ORANGE"), "&.Mui-checked": { color: noteColor("ORANGE"), }, }} />
                    <Radio {...controlProps("YELLOW")} sx={{ color: noteColor("YELLOW"), "&.Mui-checked": { color: noteColor("YELLOW"), }, }} />
                    <Radio {...controlProps("CYAN")} sx={{ color: noteColor("CYAN"), "&.Mui-checked": { color: noteColor("CYAN"), }, }} />
                    <Radio {...controlProps("BLUE")} sx={{ color: noteColor("BLUE"), "&.Mui-checked": { color: noteColor("BLUE"), }, }} />
                    <Radio {...controlProps("PURPLE")} sx={{ color: noteColor("PURPLE"), "&.Mui-checked": { color: noteColor("PURPLE"), }, }} />
                  </div>
                </FormControl>
                <FormControl>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Data"
                      value={valueDatePicker}
                      inputFormat="DD-MM-YYYY"
                      onChange={(newValue) => { setValueDatePicker(newValue); setValue("datePicker", newValue); }}
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
                      onChange={(newValue) => { setValueTimePicker(newValue); setValue("timePicker", newValue); }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                  <FormHelperText>{errors?.timePicker?.message}</FormHelperText>
                </FormControl>
                <Button variant="contained" type="submit" onClick={() => {
                  setValue("descriptionTasks", "Task");
                }}>
                  Criar
                </Button>
              </Box>
            </form>
          </Modal>
        </div>
      </Header>
      <Cards>
        {userNotes?.map((item, index) => (
          <Card key={index} sx={{ minWidth: 275, maxWidth: "auto", backgroundColor: `${noteColor(item.color)}`, color: "white", }}>
            <CardContent>
              <div style={{ color: "white", width: "100%", height: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.1rem" }}>
                <Typography style={{ width: "33%", fontSize: 14, marginRight: "auto", display: "flex", justifyContent: "center", alignItems: "center", }} >
                  {item.date !== null && dayjs(item.date).format("DD/MM/YYYY")}
                </Typography>
                <Typography style={{ width: "33%", fontSize: 14, marginLeft: "auto", marginRight: "auto", display: "flex", justifyContent: "center", alignItems: "center", }} >
                  {item.time !== null && <>{item.time}</>}
                </Typography>
                <Typography style={{ width: "33%", fontSize: 14, marginLeft: "auto", display: "flex", justifyContent: "center", alignItems: "center", }}>
                  {item.taskNotes?.length > 0 && (
                    <>
                      Lista{" "}
                      {
                        item.taskNotes.filter(
                          (task) => task.status === "COMPLETE"
                        ).length
                      }{" "}
                      / {item.taskNotes.length}
                    </>
                  )}
                </Typography>
              </div>
              <Typography variant="h6" component="div" style={{ whiteSpace: "nowrap", width: "100%", overflow: "hidden", textOverflow: "ellipsis", }}>
                {item.title}
              </Typography>
              <Typography variant="body2" style={{ whiteSpace: "nowrap", width: "100%", height: "1rem", overflow: "hidden", textOverflow: "ellipsis", }}>
                {item.description}
              </Typography>
            </CardContent>
            <CardActions>
              <Button variant="outlined" color="inherit" onClick={() => handleOpenModalViewNote(item)}              >
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
        <Box sx={boxStyle} style={{ width: 625 }} >
          <div style={{ width: "100%" }}>
            {alertErrorTask !== "" && (<Alert severity="error"> <div>{alertErrorTask}</div> </Alert>)} {alertSuccessTask !== "" && (<Alert severity="success"> <div>{alertSuccessTask}</div> </Alert>)}
          </div>
          <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", }}>
            {
              editNote ?
                (
                  <form onSubmit={handleSubmit(handleUpdateNote)}>
                    <Box style={{ width: "400px", display: "flex", flexDirection: "column", gap: 10 }}>
                      <Typography variant="h5" component="div" className="center">Editar Nota</Typography>
                      <FormControl>
                        <InputLabel>Título*</InputLabel>
                        <OutlinedInput
                          label="Título*"
                          {...register("title")}
                          placeholder="Título"
                          defaultValue={selectedItem.title}
                          endAdornment={<InputAdornment position="end"><span style={{ color: `${title.length > 40 ? "red" : "gray"}`, }}>  {title.length}     </span>/40    </InputAdornment>}
                          onChange={(event) => { setTitle(event.target.value); }} />
                        <FormHelperText>{errors.title?.message}</FormHelperText>
                      </FormControl>
                      <FormControl>
                        <InputLabel>Descrição</InputLabel>
                        <OutlinedInput
                          label="Descrição"
                          {...register("descriptionNotes")}
                          placeholder="Descrição"
                          defaultValue={selectedItem.description}
                          endAdornment={<InputAdornment position="end"><span style={{ color: `${descriptionNotes.length > 200 ? "red" : "gray"}`, }}>{descriptionNotes.length}</span>/200</InputAdornment>}
                          onChange={(event) => { setDescriptionNotes(event.target.value); }} />
                        <FormHelperText>{errors.descriptionNotes?.message}</FormHelperText>
                      </FormControl>
                      <FormControl style={{ display: "flex", justifyContent: "space-around", alignItems: "center", flexDirection: "row", }}>
                        <Typography color={"gray"}>Cor</Typography>
                        <div>
                          <Radio {...controlProps("RED")} sx={{ color: noteColor("RED"), "&.Mui-checked": { color: noteColor("RED"), }, }} />
                          <Radio {...controlProps("ORANGE")} sx={{ color: noteColor("ORANGE"), "&.Mui-checked": { color: noteColor("ORANGE"), }, }} />
                          <Radio {...controlProps("YELLOW")} sx={{ color: noteColor("YELLOW"), "&.Mui-checked": { color: noteColor("YELLOW"), }, }} />
                          <Radio {...controlProps("CYAN")} sx={{ color: noteColor("CYAN"), "&.Mui-checked": { color: noteColor("CYAN"), }, }} />
                          <Radio {...controlProps("BLUE")} sx={{ color: noteColor("BLUE"), "&.Mui-checked": { color: noteColor("BLUE"), }, }} />
                          <Radio {...controlProps("PURPLE")} sx={{ color: noteColor("PURPLE"), "&.Mui-checked": { color: noteColor("PURPLE"), }, }} />
                        </div>
                      </FormControl>
                      <div className="center" style={{ gap: 20, marginTop: 20 }}>
                        <Button color="success" variant="contained" type="submit" onClick={() => {
                          setValue("descriptionTasks", "Task");
                        }}>
                          Confirmar
                        </Button>
                        <Button color="error" variant="contained" onClick={handleClickEditNote}>
                          Cancelar
                        </Button>
                      </div>
                    </Box>
                  </form>
                ) : (
                  <>
                    <div style={{ width: "70%", display: "flex", flexDirection: "column", }}>
                      <Typography style={{ fontSize: 16 }}>
                        {selectedItem?.title}
                      </Typography>
                      <Typography
                        style={{ fontSize: 12, width: "100%", overflowWrap: "break-word", wordWrap: "break-word", wordBreak: "break-word", }}>
                        {selectedItem?.description}
                      </Typography>
                    </div>
                    <div>
                      <IconButton onClick={handleClickEditNote}>
                        <Edit color="primary" />
                      </IconButton>
                      <IconButton onClick={handleDeleteNote}>
                        <Delete color="error" />
                      </IconButton>
                    </div>
                  </>
                )
            }
          </div>
          {
            !editNote &&
            <>
              <div className="center" style={{ width: "100%", height: "5rem", }}>
                <Button onClick={() => { setNewTask(true); }} style={{ display: `${NewTask ? "none" : "flex"}` }} color="primary" variant="outlined" startIcon={<Add />} >
                  Adicionar item
                </Button>
                {NewTask && (
                  <form onSubmit={handleSubmit(handleCreateTask)} className="center">
                    <FormControl>
                      <InputLabel>Item*</InputLabel>
                      <OutlinedInput
                        label="Item*"
                        {...register("descriptionTasks")}
                        placeholder="Descrição"
                        endAdornment={<InputAdornment position="end"><span style={{ color: `${descriptionTasks.length > 50 ? "red" : "gray"}`, }}>{descriptionTasks.length}</span>/50</InputAdornment>}
                        onChange={(event) => { setDescriptionTasks(event.target.value); }} />
                      <FormHelperText>
                        {errors.descriptionTasks?.message}
                      </FormHelperText>
                    </FormControl>
                    <div>
                      <IconButton type="submit" onClick={() => { setValue("title", "Task"); }}>
                        <Done color="success" />
                      </IconButton>
                      <IconButton onClick={() => { setNewTask(false); }}>
                        <Cancel color="error" />
                      </IconButton>
                    </div>
                  </form>
                )}
              </div>
              <div style={{ width: "100%", maxHeight: "500px", display: "flex", flexDirection: "column", overflowY: "scroll" }} >
                {selectedItem?.taskNotes?.map((task, index) => (
                  <div key={index} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem", }}>
                    <Checkbox checked={task.status === "COMPLETE"} onClick={() => { setIsChange(true); handleUpdateTask(task); }} color="success" />
                    <span style={{ width: "100%", justifyContent: "flex-start" }}>
                      {task.description}
                    </span>
                    <IconButton onClick={() => { handleDeleteTask(task); }}>
                      <Delete color="error" />
                    </IconButton>
                  </div>
                ))}
              </div>
            </>
          }
        </Box>
      </Modal>
    </Container >
  );
}

const boxStyle = { position: "absolute" as "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", bgcolor: "background.paper", borderRadius: 1, boxShadow: 24, p: 4, gap: 1, };
