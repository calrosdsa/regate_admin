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
      API_URL: process.env.API_URL,
      MB_API_KEY: process.env.MB_API_KEY,
      API_URL_MESSAGE: process.env.API_URL_MESSAGE
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
}
  

module.exports = nextConfig
