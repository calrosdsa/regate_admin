"use client";

import Eventos from "@/presentation/pages/evento/eventos/Eventos";

const Page = ({ params }: { params: { uuid: string } }) => {
 
  return (
    <>
    <Eventos
    params={params}
    />
    </>
  );
};

export default Page;
