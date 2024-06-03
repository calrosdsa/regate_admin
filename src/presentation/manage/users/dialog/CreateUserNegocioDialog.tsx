import React, { FormEvent, Fragment, useState } from "react";
import InputPassword from "@/presentation/util/input/InputPassword";
import ButtonSubmit from "@/presentation/util/button/ButtonSubmit";
import { useAppDispatch, useAppSelector } from "@/context/reduxHooks";
import { toast } from "react-toastify";
import DialogHeader from "@/presentation/util/dialog/DialogHeader";
import { Http, UserRol } from "@/core/type/enums";
import { getEstablecimientos } from "@/context/actions/account-actions";
import Image from "next/image";
import Loading from "@/presentation/util/loaders/Loading";
import ButtonWithLoader from "@/presentation/util/button/ButtonWithLoader";
import { uiActions } from "@/context/slices/uiSlice";
import InputWithIcon from "@/presentation/util/input/InputWithIcon";
import { unexpectedError } from "@/context/config";
import DialogLayout from "@/presentation/util/dialog/DialogLayout";
import { GetEstablecimientos } from "@/core/repository/establecimiento";
import { CreateUser } from "@/core/repository/manage";
import {
  Button,
  Checkbox,
  DialogActions,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Switch,
  Typography,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
interface Props {
  openModal: boolean;
  closeModal: () => void;
  refreshUsers: () => void;
}

type Data = {
  username: string;
  email: string;
  rol: number | undefined;
};

enum Tab {
  MAIN,
  ESTABLECIMIENTOS,
}

const CreateUserNegocioDialog: React.FC<Props> = ({
  openModal,
  closeModal,
  refreshUsers,
}) => {
  // const [openDialogConfirm,setOpenDialogConfirm] = useState(false)
  const dispatch = useAppDispatch();
  // const establecimientos = useAppSelector(state => state.account.establecimientos)
  const [loading, setLaoding] = useState(false);
  const uiState = useAppSelector((state) => state.ui);
  const [currentTab, setCurrentTab] = useState(Tab.MAIN);
  const [establecimientosIds, setEstablecimientoIds] = useState<
    EstablecimientoUser[]
  >([]);
  // const loading = useAppSelector(state=>state.ui.loading)
  const [formData, setFormData] = useState<Data>({
    username: "",
    email: "",
    rol: UserRol.CLIENT_USER_ROL,
  });
  const { username, email, rol } = formData;
  const [establecimientos, setEstablecimientos] = useState<
    EstablecimientoData[]
  >([]);
  const getDataEstablecimientos = async () => {
    try {
      dispatch(uiActions.setInnerLoading(true));
      const data: EstablecimientoData[] = await GetEstablecimientos();
      dispatch(uiActions.setInnerLoading(false));
      setEstablecimientos(data);
    } catch (err) {
      dispatch(uiActions.setInnerLoading(false));
    }
    // setReservas(data)
  };
  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const selectEstablecimientos = (id: number) => {
    const establecimiento = establecimientos.find((item) => item.id == id);
    if (establecimiento != undefined) {
      const currentEstablecimiento: EstablecimientoUser = {
        uuid: establecimiento.uuid,
        name: establecimiento.name,
        id: establecimiento.id,
      };
      if (
        establecimientosIds
          .map((item) => item.uuid)
          .includes(currentEstablecimiento.uuid)
      ) {
        const newIds = establecimientosIds.filter(
          (item) => item.uuid != currentEstablecimiento.uuid
        );
        setEstablecimientoIds(newIds);
      } else {
        setEstablecimientoIds([...establecimientosIds, currentEstablecimiento]);
      }
    }
  };

  const createUser = async () => {
    try {
      setLaoding(true);
      const request: CreateUserRequest = {
        email: email,
        username: username,
        rol: rol as number,
        establecimientos: establecimientosIds,
      };
      const res: Response = await CreateUser(request);
      const data = await res.json();
      switch (res.status) {
        case 400:
          toast.error(data.message);
          break;
        case 200:
          refreshUsers();
          toast.success("Se ha agragado un nuevo usuario");
          closeModal();
          break;
      }
      setLaoding(false);
    } catch (err: any) {
      setLaoding(false);
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setLaoding(true);
      if (rol == UserRol.CLIENT_USER_ROL) {
        if (establecimientos.length == 0) {
          getDataEstablecimientos();
        }
        setCurrentTab(Tab.ESTABLECIMIENTOS);
        setLaoding(false);
        return;
      }
      const request: CreateUserRequest = {
        email: email,
        username: username,
        rol: rol as number,
        establecimientos: [],
      };
      const res: Response = await CreateUser(request);
      switch (res.status) {
        case Http.StatusOk:
          refreshUsers();
          toast.success("Se ha agragado un nuevo usuario");
          closeModal();
          setLaoding(false);
          break;
        case Http.StatusBadRequest:
          const data: ResponseMessage = await res.json();
          toast.error(data.message);
          setLaoding(false);
          break;
      }
    } catch (err) {
      toast.error(unexpectedError);
      setLaoding(false);
    }
  };

  return (
    <>
      <DialogLayout
        title="Crear administrador"
        className=" max-w-lg"
        open={openModal}
        close={closeModal}
      >
        <div className="rounded-lg overflow-auto">
          {Tab.MAIN == currentTab && (
            <form className="grid gap-y-3" onSubmit={onSubmit}>
              <InputWithIcon
                value={username}
                onChange={onChange}
                name="username"
                label="Nombre"
              />
              <InputWithIcon
                value={email}
                onChange={onChange}
                name="email"
                label="Email"
                type="email"
              />

              <div>
                <Typography variant="body2" sx={{ my: 1 }}>
                  Asignar rol
                </Typography>

                <Paper elevation={2} className="py-2 space-y-4">
                  <div className="grid grid-cols-6 place-items-center">
                    <div className="col-span-5 grid grid-cols-8">
                      <PersonIcon className="col-span-1 place-self-center" />
                      <div className=" col-span-7">
                        <Typography className="font-semibold">
                          Acceso de usuario
                        </Typography>
                        <Typography
                          variant="body2"
                          fontSize={13}
                          className="text-[13px] leading-3"
                        >
                          Un usuario con el rol de usuario tendrá acceso
                          restringido y solo podrá gestionar los
                          establecimientos designados por un administrador.
                        </Typography>
                      </div>
                    </div>

                    <Switch
                      checked={rol == UserRol.CLIENT_USER_ROL}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            rol: UserRol.CLIENT_USER_ROL,
                          });
                        } else {
                          setFormData({
                            ...formData,
                            rol: UserRol.ADMIN_USER_ROL,
                          });
                        }
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-6 place-items-center">
                    <div className="col-span-5 grid grid-cols-8">
                      <VerifiedUserIcon className="col-span-1 place-self-center" />

                      <div className=" col-span-7">
                        <Typography className="font-semibold">
                          Acceso de administrador
                        </Typography>
                        <Typography
                          variant="body2"
                          fontSize={13}
                          className="text-[13px] leading-3"
                        >
                          Los usuarios con rol de administrador tendrán el
                          control total. Pueden modificar la configuración, los
                          usuarios y datos de la organización.
                        </Typography>
                      </div>
                    </div>

                    <Switch
                      checked={rol == UserRol.ADMIN_USER_ROL}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            rol: UserRol.ADMIN_USER_ROL,
                          });
                        } else {
                          setFormData({
                            ...formData,
                            rol: UserRol.CLIENT_USER_ROL,
                          });
                        }
                      }}
                    />
                  </div>
                </Paper>
              </div>

              <ButtonSubmit loading={loading} title="Confirmar" />
            </form>
          )}
          {Tab.ESTABLECIMIENTOS == currentTab && (
            <div className=" pt-2">
              <Loading
                loading={uiState.innerLoading}
                className="pt-2 flex w-full justify-center"
              />
              <List sx={{ width: "100%" }}>
                {establecimientos.map((item, idx) => {
                  const labelId = `checkbox-list-label-${idx}`;
                  return (
                    <ListItemButton
                      key={idx}
                      role={undefined}
                      onClick={() => selectEstablecimientos(item.id)}
                      dense
                    >
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={establecimientosIds
                            .map((item) => item.uuid)
                            .includes(item.uuid)}
                          tabIndex={-1}
                          disableRipple
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                      </ListItemIcon>
                      <ListItemText id={labelId} primary={item.name} />
                    </ListItemButton>
                    // return(
                    //   <div key={idx} onClick={()=>selectEstablecimientos(item.id)}
                    //   className='flex justify-between items-center px-2 py-3 border-b-[1px] cursor-pointer
                    //   hover:bg-gray-200'>
                    //     <span className='title'>{item.name}</span>

                    //     <input type="checkbox" checked={establecimientosIds.map(item=>item.uuid).includes(item.uuid)}
                    //     onChange={()=>selectEstablecimientos(item.id)}/>
                    //   </div>
                  );
                })}
              </List>

              <DialogActions>
                <div className=" space-x-2">
                  <Button
                    variant="contained"
                    onClick={() => setCurrentTab(Tab.MAIN)}
                  >
                    Volver
                  </Button>
                  <ButtonWithLoader
                    loading={loading}
                    title="Crear usuario"
                    onClick={() => createUser()}
                  />
                </div>
              </DialogActions>
              {/* <button className='button' onClick={()=>createUser()}>Crear usuario</button> */}
            </div>
          )}
        </div>
      </DialogLayout>
    </>
  );
};

export default CreateUserNegocioDialog;
