import useSWR from "swr";
import { staticContentEachPageApi } from "@/api-client/staticContentEachPage";
import { StaticContentEachPage } from "@/models/staticContentEachPage";

export function useStaticContentBySlug(slug: string | undefined, enabled = true) {
	const { data, error, isLoading, mutate } = useSWR<StaticContentEachPage | null>(
		enabled && slug ? `staticContent-${slug}` : null,
		() => (slug ? staticContentEachPageApi.getStaticContentBySlug(slug) : null)
	);

	return {
		data,
		error,
		loading: !data && !error,
		isLoading,
		mutate,
	};
}
