import { fetchInstalaciones } from "@/context/actions/data-actions";
import { useAppDispatch, useAppSelector } from "@/context/reduxHooks";
import { uiActions } from "@/context/slices/uiSlice";
import useEffectOnce from "@/core/util/hooks/useEffectOnce";
import { eventoRepository } from "@/data/repository";
import { useSearchParams } from "next/navigation";
import { useState } from "react";


export const EventoViewModel = ({ params }: { params: { uuid: string } }) =>{
    const dispatch = useAppDispatch();
    const repository = eventoRepository
    const searchParams = useSearchParams();
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    const instalaciones = useAppSelector((state) => state.data.instalaciones);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState("");
    const [paginationProps, setPaginationProps] = useState<PaginationProps | null>(null);
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [createEventoDialog, setCreateEventoDialog] = useState(false);
    const establecimientos = useAppSelector(
      (state) => state.account.establecimientos
    );
    const [selectedId, setSelectedId] = useState<number | undefined>(undefined);
    // const [deleteEventoConfirmationDialog, setDeleteConfirmationDialog] =
    //   useState(false);
    const [instalacion, setInstacion] = useState<Instalacion | null>(null);
    const [eventoCreated, setEventoCreated] = useState<Evento | null>(null);
    const [openInstalacionesDialog, setOpenInstalacionesDialog] = useState(false);
    const [openReservaDialog, setOpenReservaDialog] = useState(false);
    const [selectedEvento, setSelectedEvento] = useState<Evento | null>(null);

    const getInstalaciones = () => {
        
        dispatch(
          fetchInstalaciones(
            params.uuid,
            () => {
              dispatch(uiActions.setLoaderDialog(true));
            },
            () => {
              dispatch(uiActions.setLoaderDialog(false));
              setOpenInstalacionesDialog(true);
            }
          )
        );
      };

      const appendSerachParams = (key: string, value: string) => {
        current.set(key, value);
        const search = current.toString();
        const url = window.location.pathname + "?" + search;
        history.pushState(null, "", url);
      };
    
      const getEventos = async (page: number) => {
        try {
          setEventos([]);
          setLoading(true);
          const res = await repository.GetEventos(params.uuid, page);
          setPaginationProps({
            pageSize: res.page_size,
            count: res.count > 0 ? res.count : 0,
            nextPage: res.next_page,
            currentPage: page,
          });
          setEventos(res.results);
          setLoading(false);
        } catch (err) {
          setLoading(false);
        }
      };

      const updateEventoInTable = (e:Evento) =>{
        const n = eventos.map((item)=>{
            if(item.id == e.id){
                item = e
            }
            return item
        })
        setEventos(n)
      }
    
      
    
      useEffectOnce(() => {
        getEventos(1);
      });

      return {
        state:{
            instalaciones,
            eventos,
            query,
            loading,
            eventoCreated,
            paginationProps,
            instalacion,
            selectedId,
            selectedEvento,
            openInstalacionesDialog,
            createEventoDialog,
            openReservaDialog,
        },
        setOpenInstalacionesDialog,
        setSelectedEvento,
        setQuery,
        setInstacion,
        setOpenReservaDialog,
        setEventos,
        setCreateEventoDialog,
        setEventoCreated,
        getInstalaciones,
        getEventos,
        setPaginationProps,
        appendSerachParams,
        updateEventoInTable,
        editEventoAmount:repository.EditEventoAmount,
      }

}