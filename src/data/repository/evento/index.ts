import { EventoDataSource } from "./EventoDataSource";
import { EventoRepository } from "./EventoRepository";

const eventoDataSource = new EventoDataSource()
export const eventoRepository = new EventoRepository(eventoDataSource)