/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['pollinations.ai'],
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'loremflickr.com',
          port: '',
          pathname: '/**',
        },
      ],
    
    },
  };
  
export default nextConfig;
  