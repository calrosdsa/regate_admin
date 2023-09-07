import { useAppDispatch } from '@/context/reduxHooks';
import { DOTS, usePagination } from '@/core/util/hooks/usePagination';
import { useEffect, useState } from 'react';

interface Props{
    currentPage:number
    pageSize:number
    setPage:(num:number)=>void
    totalCount:number
    onPrev:()=>void
    onNext:()=>void
}
const Pagination = ({currentPage,setPage,totalCount,pageSize,onNext,onPrev}:Props) => {
   
    const siblingCount =1;
    // const pageSize =1
    const paginationRange = usePagination({
        currentPage,
        totalCount,
        siblingCount,
        pageSize,
    })
       


useEffect(()=>{
    // console.log(paginationRange)
},[currentPage])

    return(
        <>      
            <div className='flex px-1 space-x-3 items-center   noselect'> 
            {/* <span className='iconM'  /> */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
             className="w-5 h-5 cursor-pointer" onClick={onPrev}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>

              {paginationRange != undefined &&
              paginationRange.map((pageNumber,idx) => {
                // console.log(typeof pageNumber)
                   if (typeof pageNumber == 'string') {
                       return <span key={idx} className="text-2xl px-3 ">{DOTS}</span>;
                    }

                return (
                <span key={idx} onClick={()=>setPage(pageNumber as number)}
                className={`font-semibold cursor-pointer  px-1 ${currentPage != pageNumber ?
                    'text-black ':"text-primary"}`}
                >
                    {pageNumber}
                </span>
                );
            })}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
            className="w-5 h-5 cursor-pointer" onClick={onNext}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
            </div>
        </>
    )
}

export default Pagination;