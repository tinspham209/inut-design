import { useCallback, useEffect, useState } from "react";
import { useCreativaCart } from "@/store/cart/creativaCart";
import { readHistory, type StorageResult } from "@/utils/creativa/storage";

export function useHydratedCreativaCart() {
	const state = useCreativaCart();
	useEffect(() => {
		const refresh = () => useCreativaCart.getState().hydrate();
		refresh();
		window.addEventListener("storage", refresh);
		window.addEventListener("focus", refresh);
		return () => {
			window.removeEventListener("storage", refresh);
			window.removeEventListener("focus", refresh);
		};
	}, []);
	return state;
}

export function useCreativaOrderHistory() {
	const [history, setHistory] = useState<StorageResult<string[]>>({ value: [] });
	const [ready, setReady] = useState(false);
	const refresh = useCallback(() => {
		setHistory(readHistory());
		setReady(true);
	}, []);
	useEffect(() => {
		refresh();
		window.addEventListener("storage", refresh);
		window.addEventListener("focus", refresh);
		window.addEventListener("creativa-history", refresh);
		return () => {
			window.removeEventListener("storage", refresh);
			window.removeEventListener("focus", refresh);
			window.removeEventListener("creativa-history", refresh);
		};
	}, [refresh]);
	return { ...history, ready, refresh };
}
