import { Button } from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import Pagination from "@/presentation/shared/pagination/Pagination";
import UserReservaTable from "@/presentation/user/UserReservaTable";


const UserReservaTab = (props:{
    paginationProps:PaginationProps,
    changePage:(page:number)=>void
    reservas:Reserva[]
    getReservaDetail:(id:number)=>void
    changeOrder:(order:ReservaOrder) =>void
    order:ReservaOrder | undefined
    loading:boolean
    refresh:()=>void
}) =>{

    return (
         <div className="mt-2">
                  <div className="flex flex-wrap justify-between gap-2">
                    <Button onClick={props.refresh} variant="outlined"
                    disabled={props.loading}>
                      <RefreshIcon/>
                    </Button>
                    {props.paginationProps != undefined && (
                      <Pagination
                        currentPage={props.paginationProps.currentPage}
                        setPage={props.changePage}
                        totalCount={props.paginationProps.count || 0}
                        pageSize={props.paginationProps.pageSize}
                      />
                    )}
                  </div>

                  <div className="mt-4">
                    <UserReservaTable
                      loading={props.loading}
                      selectReserva={(e) => props.getReservaDetail(e.id)}
                      reservas={props.reservas}
                      order={props.order}
                      changeOrder={(e) => {
                        props.changeOrder(e);
                      }}
                    />
                  </div>
                </div>
    )
}

export default UserReservaTab;