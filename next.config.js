/** @type {import('next').NextConfig} */
const nextConfig = {
    env:{
        API_URL: process.env.API_URL,
        MB_API_KEY: process.env.MB_API_KEY
    },
    images:{
        remotePatterns: [
            {
              protocol: "https",
              hostname: "**",
            },
          ],
    }
}

module.exports = nextConfig
