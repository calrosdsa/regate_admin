/** @type {import('next').NextConfig} */

// const withPWA = require("next-pwa")({
//   dest: "public",
//   register: true,
//   skipWaiting: true,
// });

// const nextConfig =withPWA({ 
//     env:{
//         API_URL: process.env.API_URL,
//         MB_API_KEY: process.env.MB_API_KEY,
//         API_URL_MESSAGE: process.env.API_URL_MESSAGE
//     },
//     images:{
//         remotePatterns: [
//             {
//               protocol: "https",
//               hostname: "**",
//             },
//           ],
//     },
//     typescript: {
//       ignoreBuildErrors: true,
//     },
//   })

const nextConfig = { 
  env:{
      LOCAL_URL: process.env.LOCAL_URL,
      API_URL: process.env.API_URL,
      API_URL_CORE: process.env.API_URL_CORE,
      MB_API_KEY: process.env.MB_API_KEY,
      API_URL_MESSAGE: process.env.API_URL_MESSAGE,
      WS_URL:process.env.WS_URL,
      WS_URL_MESSAGE:process.env.WS_URL_MESSAGE,
  },
  images:{
      remotePatterns: [
          {
            protocol: "https",
            hostname: "**",
          },
        ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // output: 'standalone',
}
  

module.exports = nextConfig
