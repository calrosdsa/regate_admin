import { useAppDispatch } from '@/context/reduxHooks';
import { DOTS, usePagination } from '@/core/util/hooks/usePagination';
import { useEffect, useState } from 'react';
import { Pagination as PaginationMui } from '@mui/material';

interface Props{
    currentPage:number
    pageSize:number
    setPage:(num:number)=>void
    totalCount:number
}
const Pagination = ({currentPage,setPage,totalCount,pageSize}:Props) => {



    return(
        <>      
        <PaginationMui count={Math.ceil(totalCount/pageSize) || 0} page={currentPage} onChange={(e,page)=>{
                    setPage(page)
                }} color='primary' />
        </>
    )
}

export default Pagination;