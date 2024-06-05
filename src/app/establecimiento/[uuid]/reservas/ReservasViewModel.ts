import { useAppDispatch, useAppSelector } from "@/context/reduxHooks";
import { dataActions } from "@/context/slices/dataSlice";
import { uiActions } from "@/context/slices/uiSlice";
import { GetInstalaciones } from "@/core/repository/instalacion";
import { GetReservaDetail, getEstablecimientoReservas } from "@/core/repository/reservas";
import { SearchUsersEmpresa } from "@/core/repository/users";
import { Order, OrderQueueReserva } from "@/data/model/types/enums";
import useDebounce from "@/core/util/hooks/useDebounce";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const ReservasViewModel = ({params}:{
    params:{
        uuid:string
    }
}) => {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const totalCount = searchParams.get("totalCount");
  const dispatch = useAppDispatch();
  const current = new URLSearchParams(Array.from(searchParams.entries()));
  const reservas = useAppSelector((state) => state.data.reservas);
  // const [reservas ,setReservas ] = useState<Reserva[]>([])
  const [query, setQuery] = useState("");
  const debouncedValue = useDebounce(query,500)

  const [reservaDetail, setReservaDetail] = useState<ReservaDetail | null>(
    null
  );
  const [filterData, setFilterData] = useState<ReservaDataFilter>({
    uuid: params.uuid,
    query: "",
    order: Order.DESC,
    order_queue: OrderQueueReserva.CREATED,
    instalacion_id: "",
  });
  const [paginationProps, setPaginationProps] = useState<
    PaginationProps
  >({
    pageSize:0,
    count:0,
    nextPage:0,
    currentPage:0,
  });
  // const [reservasCount,setReservasCount] = useState<number | undefined>(undefined)
  const [loading, setLoading] = useState(false);
  const [openReservaDetailDialog, setOpenReservaDetailDialog] = useState(false);
  const [order, setOrder] = useState<ReservaOrder>({
    order: Order.DESC,
    queue: OrderQueueReserva.CREATED,
  });

  const [instalaciones, setInstalaciones] = useState<Instalacion[]>([]);
  const [selectedInstalacion, setSelectedInstalacion] = useState("0");
  const [openRequestReporteDialog, setOpenRequestReporteDialog] =
    useState(false);

  const [userEmpresa,setUserEmpresa] = useState<null | UserEmpresa>(null)
  const [users,setUsers] = useState<UserEmpresa[]>([])
  const [loadingUsers,setLoadingUsers] = useState(false)


  const appendSerachParams = (key: string, value: string) => {
    current.set(key, value);
    const search = current.toString();
    const url = window.location.pathname + "?" + search;
    history.pushState(null, "", url);
  };
  const openExportReservasDialog = () => {
    if (instalaciones.length == 0) {
      //     getInstalaciones()
    }
    setOpenRequestReporteDialog(true);
  };
  const getInstalaciones = async () => {
    try {
      if (instalaciones.length == 0) {
        const res: Instalacion[] = await GetInstalaciones(params.uuid);
        setInstalaciones(res);
      }
    } catch (err) {
      // dispatch(uiActions.setLoaderDialog(false))
    }
  };
  const getReservaDetail = async (id: number) => {
    try {
      dispatch(uiActions.setLoaderDialog(true));
      const res = await GetReservaDetail(id);
      setReservaDetail(res);
      dispatch(uiActions.setLoaderDialog(false));
    } catch (err) {
      dispatch(uiActions.setLoaderDialog(false));
    }
  };

  const onSearch = async() =>{
    try{
        // if(name == searchQuery) return
        if(query == "") {
            setUsers([])
            return
        }
        setUsers([])
        setLoadingUsers(true)
        const q = query.trim().replaceAll(/\s+/g,":* & ") + ":*"
        const res = await SearchUsersEmpresa(q)
       
        setUsers(res)
        setLoadingUsers(false)
    }catch(err){
        setLoadingUsers(false)
    }
}
 

  const searchQuery = (query: string) => {
    if (query == "") return;
    appendSerachParams("page", "1");
    // console.log(query.trim().replaceAll(/\s+/g,","))
    const q = query.trim().replaceAll(/\s+/g, ":* & ") + ":*";
    const filterD: ReservaDataFilter = {
      ...filterData,
      query: q,
    };
    if (paginationProps != undefined) {
      setPaginationProps({
        ...paginationProps,
        count: paginationProps.pageSize,
      });
    }
    // setFilterData(filterD)
    getReservas(filterD, 1);
  };
  const updateReservas = (reserva:Reserva) =>{
    dispatch(dataActions.updateReservas(reserva))
  }
  const getReservas = async (data: ReservaDataFilter, page: number) => {
    try {
      dispatch(dataActions.setReservas([]));
      setFilterData(data);
      setLoading(true);
      const res: ReservaPaginationResponse = await getEstablecimientoReservas(
        data,
        page
      );
      setPaginationProps({
        pageSize: res.page_size,
        count: res.count > 0 ? res.count : 0,
        nextPage: res.next_page,
        currentPage: page,
      });
      console.log(res);
      dispatch(dataActions.setReservas(res.results));
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };
  const applyChange = (data: ReservaDataFilter) => {
    setFilterData(data);
    if (pageParam != null) {
      getReservas(data, Number(pageParam));
    } else {
      getReservas(data, 1);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  useEffect(() => {
    if (reservaDetail != null) {
      setOpenReservaDetailDialog(true);
    }
  }, [reservaDetail]);

  useEffect(() => {
    getInstalaciones();
    if (pageParam != null) {
      getReservas(filterData, Number(pageParam));
    } else {  
      getReservas(filterData, 1);
    }
  }, []);

  useEffect(() => {
    onSearch()
    // Do fetch here...
    // Triggers when "debouncedValue" changes
  }, [debouncedValue])
  return {
    state:{
        order,
        loading,
        reservas,
        reservaDetail,
        filterData,
        openRequestReporteDialog,
        selectedInstalacion,
        openReservaDetailDialog,
        instalaciones,
        paginationProps,
        pageParam,
        query,
        users,
        loadingUsers
    },
    action:{
        onChange,
        applyChange,
        getReservaDetail,
        getReservas,
        openExportReservasDialog,
        setOpenRequestReporteDialog,
        setQuery,
        setSelectedInstalacion,
        setPaginationProps,
        appendSerachParams,
        setOrder,
        updateReservas,
        setOpenReservaDetailDialog,
        setUserEmpresa,
        setUsers
    }
  };
};
