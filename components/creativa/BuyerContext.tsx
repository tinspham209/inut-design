import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type BuyerTransfer = { publicId: string; content: string; version: string };
const BuyerContext = createContext<{
	transfer: BuyerTransfer | null;
	remember: (transfer: BuyerTransfer | null) => void;
} | null>(null);

export function CreativaBuyerProvider({ children }: { children: ReactNode }) {
	const [transfer, setTransfer] = useState<BuyerTransfer | null>(null);
	const remember = useCallback((value: BuyerTransfer | null) => setTransfer(value), []);
	const value = useMemo(() => ({ transfer, remember }), [transfer, remember]);
	return <BuyerContext.Provider value={value}>{children}</BuyerContext.Provider>;
}

export function useCreativaBuyer() {
	const context = useContext(BuyerContext);
	if (!context) throw new Error("Creativa buyer context requires its storefront provider.");
	return context;
}
