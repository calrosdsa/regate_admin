import { LOCAL_URL } from "@/context/config";

class AccountDataSource {
  SignOut(){
    const res = fetch(`${LOCAL_URL}/api/account/auth/logout`)
    return res
  }
  SignIn(data: LoginRequest) {
    const res = fetch(`../api`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res;
  }
  GetEstablecimientosUserByUuid(data: string) {
    const res = fetch("../../api/admin/manage/user/establecimientos", {
      method: "post",
      body: data,
    });
    return res;
  }

  GetAccount() {
    const res = fetch("../../api/account");
    return res;
  }

  ValidateUser() {
    const res = fetch(`../../api/account/auth/validate`);
    return res;
  }

  SendResetPasswordEmail(mail: string) {
    const res = fetch(
      `../../api/account/auth/send-reset-password?mail=${mail}`
    );
    return res;
  }

  VerifyToken(token: string) {
    const res = fetch(`../../api/account/auth/verify-token?token=${token}`);
    return res;
  }

  ResetPassword(d: PasswordRequest, token: string) {
    const res = fetch(`../../api/account/auth/reset-password?token=${token}`, {
      method: "POST",
      body: JSON.stringify(d),
    });
    return res;
  }

  UpdatePassword(d: PasswordUpdateRequest) {
    const res = fetch(`../../api/account/auth/update-password`, {
      method: "POST",
      body: JSON.stringify(d),
    });
    return res;
  }

  GetEstablecimentosUser(uuid: string) {
    const res = fetch(`${LOCAL_URL}/api/account/establecimientos?uuid=${uuid}`);
    return res;
  }
}

export default AccountDataSource;
