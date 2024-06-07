import { useAppDispatch, useAppSelector } from "@/context/reduxHooks";
import { accountRepository } from "@/data/repository";
import { ChangeEvent, FormEvent, useState } from "react";

export const LoginViewModel = () => {
  const dispatch = useAppDispatch();
  const accountRepo = accountRepository
  const uiState = useAppSelector((state) => state.ui);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;
  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      dispatch(accountRepo.SignIn(email.trim(), password.trim()));
    } catch (err) {}
  };
  return {
    state: {
      formData,
      uiState,
    },
    onSubmit,
    onChange,
  };
};
