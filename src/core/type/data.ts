type DataSlice = {
    instalaciones:Instalacion[]
    reservas:Reserva[]
}



type InstalacionWithReservaCupos = {
    instalacion:Instalacion
    cupos:ReservaCupo[]
}