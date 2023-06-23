/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true,
        serverComponentsExternalPackages: ["mongoose"],
    },
    images: {
        domains: ["firebasestorage.googleapis.com",
        "lh3.googleusercontent.com", 
        "localhost",
        "avatars.githubusercontent.com",
        "pbs.twimg.com"
    
    ],
    },
    webpack(config) {
        config.experiments = {
            ...config.experiments,
            topLevelAwait: true,
        };
        return config;
    },
};

module.exports = nextConfig;