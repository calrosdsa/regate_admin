"use client"
// import { deleteCookie } from "cookies-next"
import { toast } from "react-toastify"

export const redirectToLogin = ()=>{
    if(typeof window != 'undefined'){
        // deleteCookie("_auth")
        window.location.replace(window.location.origin + `/auth/login?redirect=${window.location.href}`)
    }
}

export const getBadRequestError = (data:any) =>{
    try{
        if(data.message = "context deadline exceeded"){
            toast.error(`¡Lo siento, pero parece que la operación ha excedido el tiempo
            de espera! Esto podría deberse a una conexión lenta o a un problema temporal en el servidor.`)                    
        }else{
            toast.error(JSON.stringify(data))
        }
    }catch(err){
        console.log(err,"badrequesterror")
    }
}