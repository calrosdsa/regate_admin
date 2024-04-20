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
    RESERVA_CREATED =2,
    USERNAME_ORDER =3
}
export const enum OrderQueueUserEmpresa {
    CREATED = 1,
    NAME =2

}

export const enum UserEstado {
    ENABLED,
    DISABLED,
    DELETED
}

export const enum ReservaEstado {
    Valid,
    Pendiente,
    Cancel
}

export const enum ReservaType {
    App,
    Local,
    Sala,
    Evento,
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
    EXPORT_DASHBOARD_DATA,
}

export enum Repeat {
    NEVER,
    DAYLY,
    WEEKLY,
    MOTHTLY
}
export enum MonthDaySelectOption {
    BY_DAY_OF_MONTH,
    BY_POSITION_DAY_OF_MONTH
}
export enum DayMonthPosition {
    FIRST,
    SECOND,
    THIRD,
    FOURTH,
    LAST
}

export enum EndOptions {
    DATE,
    COUNT,
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
    StatusOk = 200,
    StatusUnauthorized = 401,
    StatusConflict                     = 409,
    StatusBadRequest = 400
}

export enum TypeChat {
    TypeChatInboxEstablecimiento= 2
}

export enum MessageEvent {
    Message = "message"
}

export enum TypeEntity {
    ENTITY_NONE    = 0,
	ENTITY_SALA    = 1,
	ENTITY_GRUPO   = 2,
	ENTITY_ACCOUNT = 3,
	ENTITY_BILLING = 4,
	ENTITY_RESERVA = 5,
	ENTITY_ESTABLECIMIENTO = 6,
	ENTITY_URI = 7 ,
	ENTITY_SALA_COMPLETE = 8,
	ENTITY_INVITATION = 9,
	ENTITY_INSTALACION = 10,
	ENTITY_PHOTO = 11,
}