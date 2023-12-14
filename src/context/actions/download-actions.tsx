import { AnyAction, ThunkAction } from "@reduxjs/toolkit"
import { RootState } from "../store"
import axios, { Canceler } from "axios"
import { uiActions } from "../slices/uiSlice"
import { ReporteId, UserEstado, UserRol } from "@/core/type/enums"
import { GetEstablecimientos } from "@/core/repository/establecimiento"
import { accountActions } from "../slices/accountSlice"
import { adminRoutes, rootEstablecimiento } from "@/core/util/routes"
import { Id, toast } from "react-toastify"
import { redirectToLogin } from "."
import { API_URL, LOCAL_URL, unexpectedError } from "../config"
import moment from "moment"
import { ChartExportRequest } from "@/core/type/chart"


export const downloadReporteDeposito = (depositoId: number,reporteId:ReporteId) :ThunkAction<void,RootState,undefined,AnyAction> =>{
    let id:Id;
    // const source = cancelToken.source();
    return async(dispatch,getState)=>{
        try{
            const uiState = getState().ui
            dispatch(uiActions.setOngoingDownloadProcess([reporteId]))
            if(uiState.ongoingDownloadProcess.includes(reporteId)){
                    toast.info("Hay una descarga en curso.")
                }else{
                    id = toast.loading("Generando reporte, por favor espere...")
                    const date = moment().format('LLLL').replace(":",";");
                    await axios.post(`${LOCAL_URL}/api/admin/billing/deposito/reporte?depositoId=${depositoId}`,{},{
                        responseType:"blob"
                    }).then((response)=>{
                        const url = window.URL.createObjectURL(new Blob([response.data]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', `${date} - Deposito.pdf`); //or any other extension
                        document.body.appendChild(link);
                        toast.update(id, {render: "Se ha completado la descarga", type: "success", isLoading: false,autoClose:5000});
                        link.click();
                    })
            dispatch(uiActions.removeOngoingProcessFromQueue(reporteId))
            }
        }catch(err:any){
            console.log(err)
            if (axios.isCancel(err)) {
                toast.update(id, {render:"Descarga Cancelada", type: "info", isLoading: false ,autoClose:5000});
                dispatch(uiActions.removeOngoingProcessFromQueue(reporteId))                
            }else{
                dispatch(uiActions.removeOngoingProcessFromQueue(reporteId))                
                toast.update(id, {render:err.response.message, type: "error", isLoading: false ,autoClose:5000});
                // dispatch(uiActions.setLoading(false))
                if(err.response.status == 401){
                    redirectToLogin()
                }
            }

        }
    }
}


export const downloadReporteReservasExcel = (
    data:ReservaReporteRequest
    ) 
:ThunkAction<void,RootState,undefined,AnyAction>=>{
    let id:Id;
    // const source = cancelToken.source();
    return async(dispatch,getState)=>{
        try{
            const uiState = getState().ui
            dispatch(uiActions.setOngoingDownloadProcess([data.establecimiento_id]))
            if(uiState.ongoingDownloadProcess.includes(data.establecimiento_id)){
                    toast.info("Hay una descarga en curso.")
                }else{
                    id = toast.loading("Generando reporte, por favor espere...")
                    const date = moment().format('LLLL').replace(":",";");
                    await axios.post(`${LOCAL_URL}/api/reservas/reporte`,data,{
                        responseType:"blob"
                    }).then((response)=>{
                        const url = window.URL.createObjectURL(new Blob([response.data]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', `${date} - Deposito.xlsx`); //or any other extension
                        document.body.appendChild(link);
                        toast.update(id, {render: "Se ha completado la descarga", type: "success", isLoading: false,autoClose:5000});
                        link.click();
                    })
            dispatch(uiActions.removeOngoingProcessFromQueue(data.establecimiento_id))
            }
        }catch(err:any){
            console.log(err)
            if (axios.isCancel(err)) {
                toast.update(id, {render:"Descarga Cancelada", type: "info", isLoading: false ,autoClose:5000});
                dispatch(uiActions.removeOngoingProcessFromQueue(data.establecimiento_id))                
            }else{
                dispatch(uiActions.removeOngoingProcessFromQueue(data.establecimiento_id))                
                toast.update(id, {render:err.response.message, type: "error", isLoading: false ,autoClose:5000});
                // dispatch(uiActions.setLoading(false))
                if(err.response.status == 401){
                    redirectToLogin()
                }
            }

        }
    }
}


export const exportDashboardDataExcel = (
    data:ChartExportRequest
    ) 
:ThunkAction<void,RootState,undefined,AnyAction>=>{
    let id:Id;
    const identifier = 100000001
    // const source = cancelToken.source();
    return async(dispatch,getState)=>{
        try{
            const uiState = getState().ui
            dispatch(uiActions.setOngoingDownloadProcess([identifier]))
            if(uiState.ongoingDownloadProcess.includes(identifier)){
                    toast.info("Hay una descarga en curso.")
                }else{
                    id = toast.loading("Generando reporte, por favor espere...")
                    const date = moment().format('LLLL').replace(":",";");
                    await axios.post(`${LOCAL_URL}/api/establecimiento/chart/export`,data,{
                        responseType:"blob"
                    }).then((response)=>{
                        const url = window.URL.createObjectURL(new Blob([response.data]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', `${date} - Deposito.xlsx`); //or any other extension
                        document.body.appendChild(link);
                        toast.update(id, {render: "Se ha completado la descarga", type: "success", isLoading: false,autoClose:5000});
                        link.click();
                    })
            dispatch(uiActions.removeOngoingProcessFromQueue(identifier))
            }
        }catch(err:any){
            console.log(err)
            if (axios.isCancel(err)) {
                toast.update(id, {render:"Descarga Cancelada", type: "info", isLoading: false ,autoClose:5000});
                dispatch(uiActions.removeOngoingProcessFromQueue(identifier))                
            }else{
                dispatch(uiActions.removeOngoingProcessFromQueue(identifier))                
                toast.update(id, {render:err.response.message, type: "error", isLoading: false ,autoClose:5000});
                // dispatch(uiActions.setLoading(false))
                if(err.response.status == 401){
                    redirectToLogin()
                }
            }

        }
    }
}