"use client";
import ButtonSubmit from "@/presentation/util/button/ButtonSubmit";
import InputWithIcon from "@/presentation/util/input/InputWithIcon";
import { useAppDispatch, useAppSelector } from "@/context/reduxHooks";
import { Paper } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { isConstructorDeclaration } from "typescript";
import { accountRepository } from "@/data/repository";

export default function Page() {
  const accountRepo = accountRepository
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [emailSended, setEmailSended] = useState(false);
  // const authtate = useAppSelector(state=>state.auth)
  const [email, setEmail] = useState("");
  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEmail(e.target.value);
    //   dispatch(authActions.setErrrorLogin(undefined))
  };
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setLoading(true);
      const res: Response = await accountRepo.SendResetPasswordEmail(email);
      const data = await res.json();
      switch (res.status) {
        case 200:
          setEmailSended(true);
          break;
        case 400:
          toast.error(data.message);
          break;
        default:
          toast.error("Se produjo un error inesperado.");
          break;
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error("Se produjo un error inesperado.");
      console.log(err);
    }
    // window.location.assign("http://localhost:3000/establecimiento/1469058c-6084-4e1e-a191-de1d5fa3b9c5/instalaciones")
  };

  return (
    <Paper elevation={2}>
      <div className="sm:w-[400px] p-2 py-10 rounded-lg">
        <div className=" grid place-content-center place-items-center mb-6">
          <Image
            src="/images/logo.png"
            height={40}
            width={100}
            priority
            alt={"teclu-mobility"}
          />
          <span className="py-4 text-lg">Restablecer su contraseña</span>
        </div>
        {emailSended ? (
          <Paper elevation={8}>
            <div className="rounded-lg p-2 flex flex-col justify-center">
              <p className="text-sm">
                Revise su correo electrónico para obtener un enlace para
                restablecer su contraseña. Si no aparece en unos minutos, revisa
                tu carpeta de spam.
              </p>
              <span className="h-5" />
              <button
                className="button"
                onClick={() => router.push("/auth/login")}
              >
                Volver a iniciar sesión
              </button>
            </div>
          </Paper>
        ) : (
          <>
            <Paper elevation={8}>
              <div className="rounded-lg p-2 flex flex-col justify-center">
                <p className="text-sm">
                  Ingrese la dirección de correo electrónico verificada de su
                  cuenta de usuario y le enviaremos un enlace para restablecer
                  su contraseña.
                </p>
              </div>
            </Paper>
            <form onSubmit={onSubmit} className="flex flex-col gap-4 mt-4 ">
              <div className="">
                <InputWithIcon
                  placeholder="Introduce tu dirección de correo electrónico"
                  //  label='Email'
                  value={email}
                  name="email"
                  //    error={authtate.errorLogin?.email}
                  onChange={onChange}
                />
              </div>
              <ButtonSubmit title="Submit" loading={loading} />
            </form>
          </>
        )}
      </div>
    </Paper>
  );
}
