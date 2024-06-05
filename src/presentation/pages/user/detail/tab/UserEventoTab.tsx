import { Button } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import Pagination from "@/presentation/shared/pagination/Pagination";
import EventoListTable from "@/presentation/pages/evento/eventos/components/EventoListTable";

const UserEventoTab = (props: {
  paginationProps: PaginationProps;
  changePage: (page: number) => void;
  eventos: Evento[];
  loading: boolean;
  uuid: string;
  refresh: () => void;
}) => {
  return (
    <div className="mt-2">
      <div className="flex flex-wrap justify-between gap-2">
        <Button onClick={props.refresh} variant="outlined" 
        disabled={props.loading}>
          <RefreshIcon />
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
        <EventoListTable
          eventos={props.eventos}
          loading={props.loading}
          uuid={props.uuid}
          shouldShowEditOption={false}
        />
      </div>
    </div>
  );
};

export default UserEventoTab;
