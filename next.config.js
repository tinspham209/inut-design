import BundleAnalyzer from "@next/bundle-analyzer";
import path from "path";

const withBundleAnalyzer = BundleAnalyzer({
	enabled: process.env.ANALYZE === "true",
});
const backgroundRemovalEnabled = process.env.NEXT_PUBLIC_KEYCHAIN_BACKGROUND_REMOVAL_ENABLED === "true";
const deploymentChannel = process.env.DEPLOYMENT_CHANNEL || "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: ["res.cloudinary.com", "cdn.sanity.io", "*.fna.fbcdn.net"],
		unoptimized: true,
	},
	// Headers for bfcache optimization
	async headers() {
		return [
			...(deploymentChannel === "preview"
				? [
						{
							source: "/:path*",
							headers: [
								{
									key: "X-Robots-Tag",
									value: "noindex, nofollow",
								},
							],
						},
				  ]
				: []),
			{
				source: "/:path*",
				headers: [
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "X-Frame-Options",
						value: "SAMEORIGIN",
					},
					{
						key: "Referrer-Policy",
						value: "strict-origin-when-cross-origin",
					},
				],
			},
			{
				// Static assets with long cache
				source: "/_next/static/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
				],
			},
			{
				// Images with cache
				source: "/:path*.(jpg|jpeg|png|gif|ico|svg|webp)",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=86400, must-revalidate",
					},
				],
			},
			{
				source: "/creativa/:section(cart|checkout|order-tracking)/:path*",
				headers: [
					{ key: "Referrer-Policy", value: "no-referrer" },
					{ key: "Cache-Control", value: "no-store" },
					{ key: "X-Robots-Tag", value: "noindex, nofollow" },
				],
			},
		];
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
			{
				source: "/creatiave",
				destination: "/creativa",
				permanent: true,
			},
		];
	},
	webpack: (config, { isServer }) => {
		if (!backgroundRemovalEnabled) {
			config.resolve.alias = {
				...config.resolve.alias,
				"@imgly/background-removal": path.resolve(process.cwd(), "components/keychain-builder/image/backgroundRemovalDisabled.ts"),
			};
		}
		if (!isServer) {
			config.resolve.fallback.fs = false;
		} else {
			config.externals = [...(config.externals || []), "sharp"];
		}

		return config;
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
};

export default withBundleAnalyzer(nextConfig);
