/** @type {import('next').NextConfig} */
module.exports = {
	reactStrictMode: true,
	images: {
		domains: ["res.cloudinary.com", "cdn.sanity.io"],
	},
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.resolve.fallback.fs = false;
		}

		return config;
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
};
