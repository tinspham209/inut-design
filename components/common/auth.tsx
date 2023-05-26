import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export interface AuthProps {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	children: any;
}

export function Auth({ children }: AuthProps) {
	const router = useRouter();
	const { data: session } = useSession();
	useEffect(() => {
		if (!session) router.push("/login");
	}, [router, session]);

	return <div>{children}</div>;
}
