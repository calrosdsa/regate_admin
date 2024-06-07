import { AnyAction, ThunkAction } from "@reduxjs/toolkit";
import { RootState } from "@/context/store";
import { uiActions } from "@/context/slices/uiSlice";
import { HttpStatusCode, UserEstado, UserRol } from "@/data/model/types/enums";
import { toast } from "react-toastify";
import { unexpectedError } from "@/context/config";
import { adminRoutes, rootEstablecimiento } from "@/core/util/routes";
import { accountActions } from "@/context/slices/accountSlice";
import AccountDataSource from "./AccountDataSource";

export class AccountRepository {
  dataSource: AccountDataSource;
  util: Util;
  constructor(d: AccountDataSource, util: Util) {
    this.dataSource = d;
    this.util = util;
  }
  getUser = (): ThunkAction<void, RootState, undefined, AnyAction> => {
    return async (dispatch) => {
      try {
        const userLocal = localStorage.getItem("user");
        console.log("USER", userLocal);
        if (userLocal != null) {
          const user: User = JSON.parse(userLocal);
          dispatch(accountActions.setUser(user));
        }
      } catch (err) {}
    };
  };

  SignOut = (): ThunkAction<void, RootState, undefined, AnyAction> => {
    return async () => {
      try {
        const res = await this.dataSource.SignOut();
        if (res.ok) {
          this.util.redirectToLoginPage();
        }
      } catch (err) {}
    };
  };

  getEstablecimientosUser = (
    uuid: string = ""
  ): ThunkAction<void, RootState, undefined, AnyAction> => {
    return async (dispatch) => {
      try {
        dispatch(uiActions.setInnerLoading(true));
        console.log("CURRENT_UUID", uuid);
        const res = await this.dataSource.GetEstablecimentosUser(uuid);
        switch (res.status) {
          case HttpStatusCode.Unauthorized:
            this.util.redirectToLoginPage();
            break;
          case HttpStatusCode.Ok:
            const data: EstablecimientoUser[] = await res.json();
            console.log("DATA ESTABLECIOMIENTOS", data);
            dispatch(accountActions.setEstablecimientos(data));
            break;
        }
        dispatch(uiActions.setInnerLoading(false));
      } catch (e) {
        dispatch(uiActions.setInnerLoading(false));
      }
    };
  };

  SignIn = (
    email: string,
    password: string
  ): ThunkAction<void, RootState, undefined, AnyAction> => {
    return async (dispatch) => {
      try {
        const fcm_token = localStorage.getItem("_fcm");
        dispatch(uiActions.setInnerLoading(true));
        const res = await this.dataSource.SignIn({
          email,
          password,
          fcm_token,
        });
        const data = await res.json();
        switch (res.status) {
          case 200:
            localStorage.setItem("user", JSON.stringify(data.user));
            dispatch(uiActions.setInnerLoading(false));
            switch (data.user.estado) {
              case UserEstado.DISABLED:
                toast.info(
                  "Le informamos que su cuenta ha sido deshabilitada. Como resultado, no podrá iniciar sesión en este momento."
                );
                return;
              case UserEstado.DELETED:
                toast.info(
                  "Le informamos que su cuenta ha sido eliminada. Como resultado, no podrá iniciar sesión."
                );
                return;
            }

            switch (data.user.rol) {
              case UserRol.ADMIN_USER_ROL:
                window.location.assign(adminRoutes.manage.establecimientos);
                break;
              case UserRol.CLIENT_USER_ROL:
                const res = await fetch(`/api/account/establecimientos`);
                const data: EstablecimientoUser[] = await res.json();
                console.log("ESTABLECIMEINTOS", data);
                if (data.length == 1) {
                  window.location.assign(
                    `${rootEstablecimiento}/${data[0].uuid}`
                  );
                }
                window.location.replace(`/auth/establecimientos`);
                break;
            }
            dispatch(uiActions.setInnerLoading(false));
            break;
          case 400:
            toast.error(data.message);
            break;
          default:
            toast.error(unexpectedError);
        }
        dispatch(uiActions.setInnerLoading(false));
      } catch (e) {
        toast.error(unexpectedError);
        dispatch(uiActions.setInnerLoading(false));
      }
    };
  };

  GetEstablecimientosUserByUuid = async (data: string) => {
    const res = await this.dataSource.GetEstablecimientosUserByUuid(data);
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error("Failed to fetch data");
    }
    return res.json();
  };

  GetAccount = async () => {
    const res = await this.dataSource.GetAccount();
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error("Failed to fetch data");
    }
    return res.json();
  };

  ValidateUser = async () => {
    const res = await this.dataSource.ValidateUser();
    return res;
  };

  SendResetPasswordEmail = async (mail: string) => {
    const res = await this.dataSource.SendResetPasswordEmail(mail);
    return res;
  };

  VerifyToken = async (token: string) => {
    const res = await this.dataSource.VerifyToken(token);
    return res;
  };

  ResetPassword = async (d: PasswordRequest, token: string) => {
    const res = await this.dataSource.ResetPassword(d, token);
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error("Failed to fetch data");
    }
    return res.json();
  };

  UpdatePassword = async (d: PasswordUpdateRequest) => {
    const res = await this.dataSource.UpdatePassword(d);
    // if (!res.ok) {
    //   // This will activate the closest `error.js` Error Boundary
    //   throw new Error('Failed to fetch data')
    // }
    return res;
  };
}
