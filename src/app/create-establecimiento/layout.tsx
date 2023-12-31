import Image from "next/image"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';

export default function CreateEstablecmientoLayout({
    children, // will be a page or nested layout
  }: {
    children: React.ReactNode
  }) {
    return (
      <>
          <ToastContainer
      position='bottom-center'
      />
      <div className="xl:grid xl:grid-cols-2 w-full">
        {/* Include shared UI here e.g. a header or sidebar */}
        <div className="hidden xl:block">
        <img
        src={"/images/background.jpg"}
        alt="backgroun-image"
        // fill
        className="h-screen "
        // priority
        />   
        </div>

        <div className=" relative w-full h-screen">
        {children}
        </div>
      </div>
        </>
    )
  }