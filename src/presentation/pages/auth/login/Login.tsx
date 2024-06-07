"use client";
import ButtonSubmit from "@/presentation/util/button/ButtonSubmit";
import InputWithIcon from "@/presentation/util/input/InputWithIcon";
import InputPassword from "@/presentation/util/input/InputPassword";
import Image from "next/image";
import MailIcon from "@mui/icons-material/Mail";
import Link from "next/link";
import { Paper, Typography } from "@mui/material";
import { LoginViewModel } from "./LoginViewModel";
const Login = () => {
  const vm = LoginViewModel();
  const state = vm.state;

  return (
    <Paper elevation={2}>
      <div className="sm:w-[400px] shadow-md p-2 py-10 rounded-lg">
        <div className=" grid place-content-center mb-10">
          <Image
            src="/images/logo.png"
            height={40}
            width={100}
            priority
            alt={"teclu-mobility"}
          />
        </div>
        <form onSubmit={vm.onSubmit} className="flex flex-col gap-4 ">
          <div className="">
            <InputWithIcon
              label="Email"
              value={state.formData.email}
              name="email"
              size="small"
              //    error={authtate.errorLogin?.email}
              onChange={vm.onChange}
              Icon={MailIcon}
            />

            <InputPassword
              label="Contraseña"
              password={state.formData.password}
              name="password"
              size="small"
              onChange={vm.onChange}
              //    error={authtate.errorLogin?.password}
              className=""
            />
          </div>
          <Link
            href={`/auth/forgot-password`}
            className="labelText flex justify-end cursor-pointer"
          >
            <Typography variant="body2">¿Olvidaste tu contraseña?</Typography>
          </Link>

          <ButtonSubmit title="Submit" loading={state.uiState.innerLoading} />
        </form>
      </div>
    </Paper>
  );
};
export default Login;
