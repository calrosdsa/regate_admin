export const enum DayWeek {
  Domingo,
  Lunes,
  Martes,
  Miercoles,
  Jueves,
  Viernes,
  Sabado,
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
  ADMIN_USER_ROL,
}

export const enum Order {
  DESC,
  ASC,
}

export const enum OrderQueueReserva {
  CREATED = 1,
  RESERVA_CREATED = 2,
  USERNAME_ORDER = 3,
}
export const enum OrderQueueUserEmpresa {
  CREATED = 1,
  NAME = 2,
}

export const enum UserEstado {
  ENABLED,
  DISABLED,
  DELETED,
}

export const enum ReservaEstado {
  Valid,
  Pendiente,
  Cancel,
}

export const enum EventoEstado {
  Pendiente = 1,
  Valid = 2,
  Cancel = 3,
}

export const enum ReservaType {
  App = 1,
  Local = 2,
  Evento = 3,
  Sala = 4,
}

export enum TypeOfChart {
  line,
  bar,
  spline,
  pie,
  stack,
}

export enum TypeOfDate {
  hour,
  day,
  week,
  month,
  year,
}

export enum ReporteId {
  DEPOSITO,
  EXPORT_DASHBOARD_DATA,
}

export enum Repeat {
  NEVER,
  DAYLY,
  WEEKLY,
  MOTHTLY,
}
export enum MonthDaySelectOption {
  BY_DAY_OF_MONTH,
  BY_POSITION_DAY_OF_MONTH,
}
export enum DayMonthPosition {
  FIRST,
  SECOND,
  THIRD,
  FOURTH,
  LAST,
}

export enum EndOptions {
  DATE,
  COUNT,
}

export enum DepositoEstado {
  PENDIENTE = 1,
  EMITIDO = 2,
}

export enum EstablecimientoEstado {
  ESTABLECIMIENTO_VERIFICADO = 1,
  ESTABLECIMIENTO_PENDIENTE = 2,
  ESTABLECIMIENTO_BLOQUEADO = 3,
}

export enum Http {
  StatusOk = 200,
  StatusUnauthorized = 401,
  StatusConflict = 409,
  StatusBadRequest = 400,
  StatusNotAcceptable = 406,
}

export enum TypeChat {
  TypeChatInboxEstablecimiento = 2,
}

export enum MessageEvent {
  Message = "message",
}

export enum TypeEntity {
  ENTITY_NONE = 0,
  ENTITY_SALA = 1,
  ENTITY_GRUPO = 2,
  ENTITY_ACCOUNT = 3,
  ENTITY_BILLING = 4,
  ENTITY_RESERVA = 5,
  ENTITY_ESTABLECIMIENTO = 6,
  ENTITY_URI = 7,
  ENTITY_SALA_COMPLETE = 8,
  ENTITY_INVITATION = 9,
  ENTITY_INSTALACION = 10,
  ENTITY_PHOTO = 11,
}

export enum HttpStatusCode {
  Continue = 100,
  SwitchingProtocols = 101,
  Processing = 102,
  EarlyHints = 103,
  Ok = 200,
  Created = 201,
  Accepted = 202,
  NonAuthoritativeInformation = 203,
  NoContent = 204,
  ResetContent = 205,
  PartialContent = 206,
  MultiStatus = 207,
  AlreadyReported = 208,
  ImUsed = 226,
  MultipleChoices = 300,
  MovedPermanently = 301,
  Found = 302,
  SeeOther = 303,
  NotModified = 304,
  UseProxy = 305,
  Unused = 306,
  TemporaryRedirect = 307,
  PermanentRedirect = 308,
  BadRequest = 400,
  Unauthorized = 401,
  PaymentRequired = 402,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  NotAcceptable = 406,
  ProxyAuthenticationRequired = 407,
  RequestTimeout = 408,
  Conflict = 409,
  Gone = 410,
  LengthRequired = 411,
  PreconditionFailed = 412,
  PayloadTooLarge = 413,
  UriTooLong = 414,
  UnsupportedMediaType = 415,
  RangeNotSatisfiable = 416,
  ExpectationFailed = 417,
  ImATeapot = 418,
  MisdirectedRequest = 421,
  UnprocessableEntity = 422,
  Locked = 423,
  FailedDependency = 424,
  TooEarly = 425,
  UpgradeRequired = 426,
  PreconditionRequired = 428,
  TooManyRequests = 429,
  RequestHeaderFieldsTooLarge = 431,
  UnavailableForLegalReasons = 451,
  InternalServerError = 500,
  NotImplemented = 501,
  BadGateway = 502,
  ServiceUnavailable = 503,
  GatewayTimeout = 504,
  HttpVersionNotSupported = 505,
  VariantAlsoNegotiates = 506,
  InsufficientStorage = 507,
  LoopDetected = 508,
  NotExtended = 510,
  NetworkAuthenticationRequired = 511,
}
