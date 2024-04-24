import moment from "moment";

export function classNames(...classes:any) {
    return classes.filter(Boolean).join(' ')
  }


  export const getFullName = (nombre?:string,apellido?:string) => {
    return `${(nombre == null || nombre == undefined) ? "" :nombre} ${(apellido == null || apellido == undefined) ? "":apellido}`
  }

  export const formatterShorTime = (date:string):String=>{
      return  moment(date).format('LT');  
  }
  export const formatDateTime = (date:string | null | undefined):string=>{
    if(date == null || date == undefined) return "-"
    return  moment(date).format('lll');  
  }

  export const  getRandomInt = () => {
    return Date.now() + Math.floor(Math.random() * 1000);
  }

  

  export const groupByToMap = <T, Q>(array: T[], predicate: (value: T, index: number, array: T[]) => Q) =>
  array.reduce((map, value, index, array) => {
    const key = predicate(value, index, array);
    map.get(key)?.push(value) ?? map.set(key, [value]);
    return map;
  }, new Map<Q, T[]>());


  export const downloadFile = (url:string,name:string) =>{
    const link = document.createElement('a');
    document.body.appendChild(link);
    link.href = url;
    link.download = name
    // link.setAttribute('download', name); //or any other extension
    link.click()
  }

  export const formatBlankorNull = (v:number | string | null | undefined) :string=>{
    if(v == "" || v == null || v == undefined) return "-"
    return v.toString()
  }