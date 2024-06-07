import { util } from "../util"
import AccountDataSource from "./account/AccountDataSource"
import { AccountRepository } from "./account/AccountRepository"
import EstablecimientoDataSourceImpl from "./establecimiento/EstablecimientoDataSourceImpl"
import EstablecimentoRepository from "./establecimiento/EstablecimientoRepository"
import { EventoDataSource } from "./evento/EventoDataSource"
import { EventoRepository } from "./evento/EventoRepository"
import InstalacionDataSourceImpl from "./instalacion/InstalacionDataSourceImpl"
import InstalacionRepository from "./instalacion/InstalacionRepository"
import { ReservaDataSource } from "./reserva/ReservaDataSource"
import { ReservaRepository } from "./reserva/ReservaRepository"
import { UserDataSource } from "./user/UserDataSource"
import { UserRepository } from "./user/UserRepository"

const userDataSource = new UserDataSource()
export const userRepository = new UserRepository(userDataSource)

const dataSource = new AccountDataSource()
export const accountRepository = new AccountRepository(dataSource,util)


const eventoDataSource = new EventoDataSource()
export const eventoRepository = new EventoRepository(eventoDataSource)


const reservaDataSource = new ReservaDataSource()
export const reservaRepository = new ReservaRepository(reservaDataSource)

const establecimientoDataSource = new EstablecimientoDataSourceImpl()
export const establecimentoRepository = new EstablecimentoRepository(establecimientoDataSource,util)

const instalacionDataSource = new InstalacionDataSourceImpl()
export const instalacionRepository = new InstalacionRepository(instalacionDataSource)