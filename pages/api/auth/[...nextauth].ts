import { firestore } from "@/libs/firebase-server";
import { FirestoreAdapter } from "@next-auth/firebase-adapter";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
	adapter: FirestoreAdapter(firestore),
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		}),
	],
	pages: {
		signIn: "/login",
	},
	debug: process.env.NODE_ENV === "development",
	logger: {
		error(code, metadata) {
			console.error("error code:", code);
			console.error("error metadata: ", metadata);
		},
		warn(code) {
			console.warn("error warn code:", code);
		},
	},
	session: {
		strategy: "jwt",
	},
	secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
