/** @type {import('next').NextConfig} */
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
