"use client"

import Loading from "@/components/util/loaders/Loading"
import { LOCAL_URL } from "@/context/config"
import { GetEstablecimientos } from "@/core/repository/establecimiento"
import { Box, Button, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import Link from "next/link"
import { useEffect, useState } from "react"
import RefreshIcon from '@mui/icons-material/Refresh';
import LinearProgressMui from "@/components/util/loaders/LinnearProgressMui"
import { StyledTableRow } from "@/components/util/table/StyleTableCell"
    
  export default function Page(){
    const [establecimientos,setEstablecimientos] = useState<EstablecimientoData[]>([])
    const [loading,setLoading] = useState(false)
    
    const getDataEstablecimientos = async()=>{
        try{
            setEstablecimientos([])
            setLoading(true)
            const data:EstablecimientoData[] = await GetEstablecimientos()
            setEstablecimientos(data)
            setLoading(false)
        }catch(err){
            setLoading(true)
        }
            // setReservas(data)
    }

    useEffect(()=>{
        getDataEstablecimientos()
    },[])
    // const data:Establecimiento[] = await getData()

    return (
        <div className=" px-2">

            <div className=" flex space-x-3 pt-2">
                <Button variant="contained" 
                href={"/create-establecimiento"}
                LinkComponent={Link}>
                Crear Establecimiento  
                </Button>
         {/* <Link href={"/create-establecimiento"}
          className="button">Crear Establecimiento</Link>    */}

          <Button  disabled={loading} onClick={()=>getDataEstablecimientos()} variant="contained">
                   <RefreshIcon />            
                </Button>
          </div>
         <div className="h-4"/>

         <div className=" overflow-auto">
         {/* <div className={`  relative ${loading && "h-20"}`}>
            <Loading
            loading={loading}
            className=" absolute top-12 left-1/2 -translate-x-1/2"
        /> */}
        <Paper elevation={2} sx={{widht:"100%"}}>
    <TableContainer>
        <LinearProgressMui
        loading={loading}
        />
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
                <TableCell  className="">
                </TableCell>
                <TableCell  className="px-6 py-3 h">
                    Nombre del Establecimiento
                </TableCell>          
          </TableRow>
        </TableHead>
        <TableBody>

            {establecimientos.map((item,index)=>{
                return(
                    <StyledTableRow
                    key={item.uuid}
                  >
                    <TableCell>
                    {index + 1}.-
                    </TableCell>
                    {/* <tr key={item.uuid} className={`${index % 2 && "bg-gray-100"}`}> */}
                <TableCell scope="row">
                    <Link href={`${LOCAL_URL}/establecimiento/${item.uuid}`} className="underline">
                    {item.name}
                    </Link>
                </TableCell>
                {/* <TableCell >
                    <Button size="small" LinkComponent={Link} href={`${LOCAL_URL}/establecimiento/${item.uuid}`}>
                    Ver
                    </Button>
                </TableCell> */}
                </StyledTableRow>
            
        )})}
        </TableBody>
      </Table>
    </TableContainer>
        </Paper>

         
       </div>

        </div>
    )
}
