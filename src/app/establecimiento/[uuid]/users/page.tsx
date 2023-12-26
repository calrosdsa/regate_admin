"use client"
import UserListTable from "@/components/user/UserListTable"
import EditUserEmpresaDialog from "@/components/user/dialog/EditUserEmpresaDialog"
import SearchInput from "@/components/util/input/SearchInput"
import Pagination from "@/components/util/pagination/Pagination"
import { GetUsersEmpresaPagination } from "@/core/repository/users"
import useEffectOnce from "@/core/util/hooks/useEffectOnce"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
const Page = ({ params }: { params: { uuid: string } }) =>{
    const searchParams = useSearchParams();
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    const [users,setUsers] = useState<UserEmpresa[]>([])
    const [loading,setLoading] = useState(false)
    const [query,setQuery] = useState("")
    const [paginationProps,setPaginationProps] = useState<PaginationProps | undefined>(undefined)
    const [openEditUserDialog,setOpenEditUserDialog] = useState(false)
    const [filterData,setFilterData] = useState<RequestUserEmpresaFilter>({
        query:"",
        // order:Order.DESC,
        // order_queue:OrderQueue.CREATED,
    })
    const [userEmpresa,setUserEmpresa] = useState<UserEmpresa | undefined>(undefined)

    const appendSerachParams = (key:string,value:string)=>{
        current.set(key,value);
        const search = current.toString();
        const url  = window.location.pathname + '?' + search;
        history.pushState(null,'',url)
    }
    const searchQuery = (query:string) =>{
        if(query == "") return
        appendSerachParams("page","1")
        // console.log(query.trim().replaceAll(/\s+/g,","))
        const q = query.trim().replaceAll(/\s+/g,":* & ") + ":*"
        const filterD:RequestUserEmpresaFilter = {
            ...filterData,
            query:q
        }
        if(paginationProps != undefined){
            setPaginationProps({
                ...paginationProps,
                count:paginationProps.pageSize
            })
        }
        setFilterData(filterD)
        getUsersEmpresa(filterD,1)
    }
    const getUsersEmpresa = async(data:RequestUserEmpresaFilter,page:number) =>{
        try{
            setUsers([])
            setLoading(true)
            const res:PaginationUserEmpresaResponse = await GetUsersEmpresaPagination(data,page)
            setPaginationProps({
                pageSize:res.page_size,
                count:res.count > 0 ? res.count : 0,
                nextPage:res.next_page,
                currentPage:page
            })
            // if(data.query != ""){
            //     setReservasCount(res.count)
            // }else{
            //     if(totalCount != null){
            //         setReservasCount(Number(totalCount))
            //     }
            // }
            setUsers(res.results)
            setLoading(false)
        }catch(err){
            setLoading(false)
            console.log(err)
        }
    }

    const onChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setQuery(e.target.value)
    }
    const onPrev = () => {
        if(paginationProps == undefined) return
        if(paginationProps.currentPage == 1){
            return
        }else {
            const pagePrev = paginationProps.currentPage -1
            // appendSerachParams("page",pagePrev.toString
            getUsersEmpresa(filterData,pagePrev)
        }
    }
    const onNext = () => {
        if(paginationProps == undefined) return
        if(paginationProps.nextPage == 0){
            return
        }else {
            const nextPage = paginationProps.currentPage + 1
            // appendSerachParams("page",nextPage.toString
            getUsersEmpresa(filterData,nextPage)
        }
    }
    useEffectOnce(()=>{
        getUsersEmpresa(filterData,1)
    })
    return(
        <>
        {(openEditUserDialog && userEmpresa != undefined) && 
        <EditUserEmpresaDialog
        open={openEditUserDialog}
        close={()=>setOpenEditUserDialog(false)}
        userEmpresa={userEmpresa}
        onUpdate={(name,phone)=>{
            const updateUser = {...userEmpresa,name:name,phone_number:phone}
            const updateUserList= users.map(item=> {
                if(item.id == updateUser.id){
                    item = updateUser
                }
                return item
            })
            setUsers(updateUserList)
        }}/>
        }
        <div className="p-2 overflow-auto h-screen">

            <div>
                <span className="subtitle">Usuarios</span>
            </div>

            <div className="pt-10 xl:pt-2">
                <span className="text-xl">Usuarios({paginationProps?.count})</span>

            <div className="flex space-x-3 py-2">
          
                <button className="button-inv" disabled={loading}  onClick={()=>{
                  setQuery("")
                  getUsersEmpresa(filterData,1)
                    }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
  <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z" clipRule="evenodd" />
                 </svg>
                </button>
                
                {/* <button className="button-inv flex space-x-1" disabled={loading}  onClick={()=>setCreateReservaDialog(true)}>
                        <span>Crear Reserva</span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
  <path d="M10.75 6.75a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" />
                        </svg>
                </button>
     */}

            </div>
            <div className="pt-2 pb-4 sm:flex md:justify-between md:items-center grid gap-2 relative">
                <div className="flex space-x-2 items-center">
                <SearchInput
                className=" sm:w-64"
                placeholder="Buscar por nombre"
                onChange={onChange}
                value={query}
                clear={()=>{
                    setQuery("")
                    const filter  = {...filterData,query:""}
                    setFilterData(filter)
                    getUsersEmpresa(filter,1)
                    if(paginationProps == undefined) return
                    setPaginationProps({
                        ...paginationProps,
                        count:0
                    })
                }}
                onEnter={(query)=>searchQuery(query)}
                />
                {/* {(paginationProps != undefined && paginationProps.count > 0 && query != "") &&
                <span>{paginationProps.count} {paginationProps.count > 1 ? "coincidencias":"coincidencia"}</span>
                } */}
                </div>
                {paginationProps != undefined &&
                    <Pagination
                    currentPage={paginationProps.currentPage}
                    setPage={(page)=>{
                        // console.log(Math.ceil(paginationProps.count/paginationProps.pageSize))
                        appendSerachParams("page",page.toString())
                        getUsersEmpresa(filterData,page)
                        setPaginationProps({
                            ...paginationProps,
                            currentPage:page
                        })
                    }}
                    totalCount={paginationProps.count || 0}
                    pageSize={paginationProps.pageSize}
                    onPrev={onPrev}
                    onNext={onNext}
                    />
                }
            </div>
                {query != "" &&
                <span className="italic text-sm  text-gray-600">Pulse intro para filtrar por prefijo:{query}</span>
                }
        </div>

        <div className=" overflow-auto">
            <UserListTable
            usersEmpresa={users}
            loading={loading}
            uuid={params.uuid}
            selectUser={(e:UserEmpresa)=>{
                setUserEmpresa(e)
                setOpenEditUserDialog(true)
            }}
            />
        </div>

        </div>
        </>
    )
}

export default Page;