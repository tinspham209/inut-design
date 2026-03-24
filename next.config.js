import BundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = BundleAnalyzer({
	enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	images: {
		domains: ["res.cloudinary.com", "cdn.sanity.io"],
		unoptimized: true,
	},
	async redirects() {
		return [
			{
				source: "/products",
				destination: "/san-pham/skin-laptop",
				permanent: true,
			},
			{
				source: "/products/:slug*",
				destination: "/san-pham/skin-laptop/:slug*",
				permanent: true,
			},
			{
				source: "/macnut",
				destination: "/san-pham/skin-nut-phim",
				permanent: true,
			},
			{
				source: "/macnut/:slug*",
				destination: "/san-pham/skin-nut-phim/:slug*",
				permanent: true,
			},
		];
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

export default withBundleAnalyzer(nextConfig);
