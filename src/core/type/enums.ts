export const enum DayWeek {
    Domingo,Lunes,Martes,Miercoles,Jueves,Viernes,Sabado
}

export const enum PaidType {
    LOCAL,
    DEFERRED_PAYMENT,
    UPFRONT_PAYMENT,
}


export const enum EstadoVisibility {
    DISABLED,
    ENABLED,
}


export const enum UserRol {
    CLIENT_USER_ROL,
    ADMIN_USER_ROL
}

export const enum Order {
    DESC,
    ASC,
}

export const enum OrderQueue {
    CREATED = 1,
    RESERVA_CREATED
}

export const enum UserEstado {
    ENABLED,
    DISABLED,
    DELETED
}

export const enum ReservaEstado {
    Valid,
    Expired,
    Cancel
}

export enum TypeOfChart {
    line,
    bar,
    spline,
    pie,
    stack
}

export enum TypeOfDate {
    hour,
    day,
    week,
    month,
    year,
}

export enum ReporteId{
    DEPOSITO,
}

export enum DepositoEstado {
    PENDIENTE =1,
    EMITIDO = 2
}

export enum EstablecimientoEstado {
    ESTABLECIMIENTO_VERIFICADO = 1,
    ESTABLECIMIENTO_PENDIENTE = 2,
    ESTABLECIMIENTO_BLOQUEADO = 3
}

export enum Http {
    StatusUnauthorized = 401,
    StatusBadRequest = 400
}

export enum TypeChat {
    TypeChatInboxEstablecimiento= 2
}

export enum MessageEvent {
    Message = "message"
}