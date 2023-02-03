import { Routes, Route, BrowserRouter } from "react-router-dom";

import { Home } from "./pages/Home";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { Contacts } from "./pages/Contacts";

import { DefaultLayout } from "./layouts/DefaultLayout";
import Reminders from "./pages/Reminders";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DefaultLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/entrar" element={<SignIn />} />
          <Route path="/cadastrar" element={<SignUp />} />
          <Route path="/contatos" element={<Contacts />} />
          <Route path="/notas" element={<Reminders />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
