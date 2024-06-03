import { ReservaDataSource } from "./ReservaDataSource";
import { ReservaRepository } from "./ReservaRepository";

const reservaDataSource = new ReservaDataSource()
export const reservaRepository = new ReservaRepository(reservaDataSource)