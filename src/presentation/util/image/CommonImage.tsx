import Image from "next/image"
import { useEffect } from "react"

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`
const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str)
// const keyStr =
//   'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='

// const triplet = (e1: number, e2: number, e3: number) =>
//   keyStr.charAt(e1 >> 2) +
//   keyStr.charAt(((e1 & 3) << 4) | (e2 >> 4)) +
//   keyStr.charAt(((e2 & 15) << 2) | (e3 >> 6)) +
//   keyStr.charAt(e3 & 63)

// const rgbDataURL = (r: number, g: number, b: number) =>
//   `data:image/gif;base64,R0lGODlhAQABAPAA${
//     triplet(0, r, g) + triplet(b, 255, 255)
//   }/yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==`
const CommonImage = ({src,h=128,w=128,className=""}:{
    src:string | undefined
    h?:number
    w?:number
    className?:string
  }) => {
    useEffect(()=>{
      console.log("SRC IMAGE",src)
    })
    return(
      <>
      {(src != undefined && src != "") ?
        <Image
        src={src.includes("blob") ? src : src + `?v=${new Date().getMilliseconds()}`}
        placeholder="blur"
        alt=""
        blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(w, h))}`}
        // blurDataURL={rgbDataURL(233, 233, 233)}
        width={w}
        height={h}
        className={className} 
        />
        :
        <Image
        src="/images/img-default.png"
        placeholder="blur"
        alt=""
        blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(w, h))}`}
        // blurDataURL={rgbDataURL(233, 233, 233)}
        width={w}
        height={h}
        className={className}
        />
      }
      </>
    )
}

export default CommonImage;