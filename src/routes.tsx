import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { useAuth } from "./context/userContext";

import { DefaultLayout } from "./layouts/Default/DefaultLayout";
import { ProfileLayout } from "./layouts/Profile/ProfileLayout";

import { Home } from "./pages/Home";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { Contacts } from "./pages/Contacts";
import { Reminders } from "./pages/Reminders";
import { Friends } from "./pages/Friends";
import { Profile } from "./pages/Profile";
import { Events } from "./pages/Events";
import { Calendar } from "./pages/Calendar";

const Router = () => {
  const { user } = useAuth();
  const userUUID = localStorage.getItem("@schedule:user-uuid-1.0.0");

  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<DefaultLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/entrar" element={<SignIn />} />
          <Route path="/cadastrar" element={<SignUp />} />
        </Route>
        <Route path="/" element={user || userUUID ? <DefaultLayout /> : <Navigate to="/entrar" />}>
          <Route path="/contatos" element={<Contacts />} />
          <Route path="/notas" element={<Reminders />} />
          <Route path="/amigos" element={<Friends />} />
          <Route path="/eventos" element={<Events />} />
          <Route path="/calendario" element={<Calendar />} />
        </Route>
        <Route path="/perfil" element={user || userUUID ? <ProfileLayout /> : <Navigate to="/entrar" />}>
          <Route path="*" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
