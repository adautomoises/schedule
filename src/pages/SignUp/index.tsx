import api from "../../services/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// Forms
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// Dates
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
// Styles
import { Container, Header, FormContainer } from "./styles";
import { styled, FormControlProps } from "@mui/material";
import {
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Book, ArrowBack } from "@mui/icons-material";

interface IformInputs {
  fullName: string;
  nickName: string;
  genre: "Masculino" | "Feminino" | "NaoBinary";
  birthDate: dayjs.Dayjs | null | undefined;
  email: string;
  password: string;
}

const schema = yup.object().shape({
  email: yup.string().email().required("Esse campo é obrigatório!"),
  password: yup
    .string()
    .min(6, "Mínimo de 6 caracteres")
    .max(30, "Máximo de 30 caracteres")
    .required("Esse campo é obrigatório!"),
  fullName: yup.string().required("Esse campo é obrigatório!"),
  nickName: yup.string().required("Esse campo é obrigatório!"),
  birthDate: yup
    .date()
    .required("Data de aniversário é obrigatório!")
    .nullable()
    .default(undefined)
    .typeError("Data de aniversário inválida!"),
  genre: yup.string().required("Esse campo é obrigatório!"),
});

const Form = styled(FormControl)<FormControlProps>({
  width: 300,
});
const SubmitButton = styled(Button)({
  width: 300,
  marginBottom: 16,
  "&:hover": {
    backgroundColor: "#0069d9",
    borderColor: "#0069d9",
    color: "#ffffff",
  },
});
const BackButton = styled(Button)({
  width: 120,
  "&:hover": {
    backgroundColor: "#0069d9",
    borderColor: "#0069d9",
    color: "#ffffff",
  },
});

export function SignUp() {
  const navigate = useNavigate();

  const [genre, setGenre] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [valueDatePicker, setValueDatePicker] = useState<
    dayjs.Dayjs | null | undefined
  >(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IformInputs>({
    resolver: yupResolver(schema),
  });

  const handleChangeGenre = (event: SelectChangeEvent) => {
    setGenre(event.target.value);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const onSubmit = (data: IformInputs) => {
    let request = {
      birthDate: dayjs(data.birthDate).format("YYYY-MM-DD"),
      email: data.email,
      fullName: data.fullName,
      genre: data.genre,
      nickName: data.nickName,
      password: data.password,
    };

    api
      .post("/users", request)
      .then((response) => {
        console.log(response.data);
        navigate("/entrar");
      })
      .catch((error) => console.log(error));
  };

  return (
    <Container>
      <Header>
        <div>
          <BackButton
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => {
              navigate("/");
            }}
          >
            Voltar
          </BackButton>
        </div>
        <Book color="primary" style={{ fontSize: "64px" }} />
      </Header>

      <FormContainer onSubmit={handleSubmit(onSubmit)}>
        <Form>
          <InputLabel>Nome Completo</InputLabel>
          <OutlinedInput
            label="Nome Completo"
            {...register("fullName")}
            defaultValue="Adauto Moisés"
          />
          {<FormHelperText>{errors?.fullName?.message}</FormHelperText>}
        </Form>
        <Form>
          <InputLabel>Nome de Usuário</InputLabel>
          <OutlinedInput
            label="Nome de Usuário"
            {...register("nickName")}
            defaultValue="moandleandro"
          />
          {<FormHelperText>{errors?.nickName?.message}</FormHelperText>}
        </Form>
        <Form>
          <InputLabel>Gênero</InputLabel>
          <Select
            label="Gênero"
            {...register("genre")}
            value={genre}
            onChange={handleChangeGenre}
          >
            <MenuItem value={"Masculino"}>Masculino</MenuItem>
            <MenuItem value={"Feminino"}>Feminino</MenuItem>
            <MenuItem value={"NaoBinary"}>Não-Binário</MenuItem>
          </Select>
          {<FormHelperText>{errors?.genre?.message}</FormHelperText>}
        </Form>
        <Form>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Data de Nascimento"
              value={valueDatePicker}
              inputFormat="DD-MM-YYYY"
              onChange={(newValue) => {
                setValueDatePicker(newValue);
                setValue("birthDate", newValue);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          {<FormHelperText>{errors?.birthDate?.message}</FormHelperText>}
        </Form>
        <Form>
          <InputLabel>E-mail</InputLabel>
          <OutlinedInput
            label="E-mail"
            {...register("email")}
            defaultValue="adautomaleandro@gmail.com"
          />
          {<FormHelperText>{errors?.email?.message}</FormHelperText>}
        </Form>
        <Form>
          <InputLabel>Senha</InputLabel>
          <OutlinedInput
            label="Senha"
            type={showPassword ? "text" : "password"}
            defaultValue="12345678"
            {...register("password", { required: true, minLength: 6 })}
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={handleClickShowPassword} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          {<FormHelperText>{errors?.password?.message}</FormHelperText>}
        </Form>
        <SubmitButton variant="outlined" color="primary" type="submit">
          Cadastrar
        </SubmitButton>
      </FormContainer>
      <SubmitButton
        variant="outlined"
        onClick={() => {
          navigate("/entrar");
        }}
      >
        Entrar
      </SubmitButton>
    </Container>
  );
}
