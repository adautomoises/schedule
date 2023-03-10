import api from "../../services/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// Forms
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// Styles
import { Container, Header, FormContainer } from "./styles";
import { styled, FormControlProps, Snackbar, Alert } from "@mui/material";
import {
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Book, ArrowBack } from "@mui/icons-material";
import { AxiosError } from "axios";

interface IErrorResponse {
  message: string;
}

interface IformInputs {
  emailOrNickName: string;
  password: string;
}

const emailSchema = yup.string().email().required();
const usernameSchema = yup
  .string()
  .matches(/^[a-zA-Z0-9._]{3,}$/, "Username is invalid")
  .required();

const schema = yup.object().shape({
  loginSchema: yup.mixed().oneOf([emailSchema, usernameSchema]),
  password: yup.string().required("Esse campo é obrigatório!"),
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

export function SignIn() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [alertError, setAlertError] = useState("");
  const [alertSuccess, setAlertSuccess] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IformInputs>({
    resolver: yupResolver(schema),
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const onSubmit = (data: IformInputs) => {
    setAlertError("");

    let request = {
      emailOrNickName: data.emailOrNickName,
      password: data.password,
    };

    api
      .post("/login", request)
      .then((response) => {
        localStorage.setItem("@schedule:user-uuid-1.0.0", response.data.userId);
        localStorage.setItem(
          "@schedule:user-schedule-uuid-1.0.0",
          response.data.scheduleId
        );
        setAlertSuccess("Usuário logado com sucesso!");
        setTimeout(() => {
          setAlertSuccess("");
          navigate("/");
          window.location.reload();
        }, 3000);
      })
      .catch((error: AxiosError<IErrorResponse>) => {
        if (error.response) {
          setAlertError(error.response.data.message);
        }
      });
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
          <InputLabel>E-mail ou Usuário</InputLabel>
          <OutlinedInput
            label="E-mail ou Usuário"
            {...register("emailOrNickName")}
            defaultValue="adautomaleandro@gmail.com"
          />
          <FormHelperText>{errors?.emailOrNickName?.message}</FormHelperText>
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
        <SubmitButton variant="outlined" color="primary" type="submit">
          Entrar
        </SubmitButton>
      </FormContainer>
      <SubmitButton
        variant="outlined"
        onClick={() => {
          navigate("/cadastrar");
        }}
      >
        Cadastrar
      </SubmitButton>
    </Container>
  );
}
