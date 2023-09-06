import moment from "moment";

export function classNames(...classes:any) {
    return classes.filter(Boolean).join(' ')
  }


  export const getFullName = (nombre?:string,apellido?:string) => {
    return `${nombre} ${apellido == null ? "":apellido}`
  }

  export const formatterShorTime = (date:string):String=>{
      return  moment(date).format('LT');  
  }

  export const  getRandomInt = () => {
    return Date.now() + Math.floor(Math.random() * 1000);
  }
  