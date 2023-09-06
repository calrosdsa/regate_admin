import Image from "next/image"

export default function AuthLayout({
    children, // will be a page or nested layout
  }: {
    children: React.ReactNode
  }) {
    return (
      <div className="grid xl:grid xl:grid-cols-2">
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
        <div className="grid place-content-center h-screen">
        {children}
        </div>
      </div>
    )
  }