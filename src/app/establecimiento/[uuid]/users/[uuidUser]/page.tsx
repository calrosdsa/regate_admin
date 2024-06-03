"use client"


import UserDetail from "@/presentation/pages/user/detail/UserDetail";

const Page = ({ params }: { params: { uuidUser: string,uuid:string } }) => {

    return(
        <>
        <UserDetail
        params={params}
        />
        </>
    )
}


export default Page;
