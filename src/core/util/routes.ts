import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";

export const rootAdmin = "/admin"
export const rootEstablecimiento = "/establecimiento"

export const adminRoutes = {
    manage:{
        establecimientos:`${rootAdmin}/manage/establecimientos`,
        users:`${rootAdmin}/manage/users`
    },
    depositos:`${rootAdmin}/depositos`,
    dashboad:{
        main:`${rootAdmin}/dashboard`
    },
    entidad:{
        main:`${rootAdmin}/entidad`
    }
}


export const appendSerachParams = (key:string,value:string,router:AppRouterInstance,current:URLSearchParams,pathname:string)=>{
    current.set(key,value);
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
}

export const getRouteEstablecimiento= (uuid:string,route:string) =>{
    return `${rootEstablecimiento}/${uuid}/${route}`
}