import Image from "next/image"

export default function CreateEstablecmientoLayout({
    children, // will be a page or nested layout
  }: {
    children: React.ReactNode
  }) {
    return (
      <section className="xl:grid xl:grid-cols-2 w-full">
        {/* Include shared UI here e.g. a header or sidebar */}
        <div>
        <img
        src={"/images/background.jpg"}
        alt="backgroun-image"
        // fill
        className="h-screen "
        // priority
        />   
        </div>
        <div className=" relative w-full">
        {children}
        </div>
      </section>
    )
  }