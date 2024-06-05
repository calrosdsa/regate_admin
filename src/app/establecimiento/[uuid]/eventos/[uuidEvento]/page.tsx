"use client";

import EventoDetail from "@/presentation/pages/evento/detail/EventoDetail";

const Page = ({ params }: { params: { uuidEvento: string; uuid: string } }) => {
  return (
    <>
    <EventoDetail
    params={params}
    />
    </>
  )
}

export default Page;
