import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { NextAuthOptions } from "next-auth";
import prisma from "@/libs/prismadb";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		CredentialsProvider({
			name: "credentials",
			credentials: {
				email: { label: "email", type: "text" },
				password: { label: "password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					throw new Error("Invalid credentials");
				}

				const user = await prisma.user.findUnique({
					where: {
						email: credentials.email,
					},
				});

				if (!user || !user?.hashedPassword) {
					throw new Error("Invalid credentials");
				}

				const isCorrectPassword = await bcrypt.compare(credentials.password, user.hashedPassword);
				if (!isCorrectPassword) {
					throw new Error("Invalid email or password. Please try again.");
				}

				return user;
			},
		}),
	],
	pages: {
		signIn: "/login",
	},
	debug: process.env.NODE_ENV === "production",
	logger: {
		error(code, metadata) {
			console.error("error code:", code);
			console.error("error metadata: ", metadata);
		},
		warn(code) {
			console.error("error warn code:", code);
		},
		debug(code, metadata) {
			console.error("debug code:", code);
			console.error("debig metadata: ", metadata);
		},
	},
	session: {
		strategy: "jwt",
	},
	secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
