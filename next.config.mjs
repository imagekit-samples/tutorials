/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.watchOptions = {
      ignored: ['**/node_modules', '**/.git', '**/logs', '**/temp']  // Add your paths
    }
    return config
  }
};

export default nextConfig;
