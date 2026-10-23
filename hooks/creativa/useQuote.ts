import { useCallback, useEffect, useRef, useState } from "react";
import type { CreativaPurchaseLine, CreativaQuote } from "@/models/creativa";
import { useCreativaQuoteMutation } from "@/hooks/creativa/useApi";

type Input = {
	lines: CreativaPurchaseLine[];
	address: string;
	payment: "cod" | "bank_transfer";
};
type Completion = {
	success?: (quote: CreativaQuote) => void;
	failure?: (error: Error) => void;
};

export function useCreativaQuote() {
	const { trigger, reset, data, error, isMutating } = useCreativaQuoteMutation();
	const [scheduled, setScheduled] = useState(false);
	const [replacement, setReplacement] = useState<CreativaQuote | null>(null);
	const generation = useRef(0);
	const timer = useRef<ReturnType<typeof setTimeout>>();
	const source = useRef<Input | null>(null);
	const invalidate = useCallback(() => {
		generation.current += 1;
		clearTimeout(timer.current);
		source.current = null;
		reset();
		setScheduled(false);
		setReplacement(null);
	}, [reset]);
	const refresh = useCallback(
		(input: Input, completion: Completion = {}) => {
			invalidate();
			const current = generation.current;
			setScheduled(true);
			timer.current = setTimeout(async () => {
				try {
					const next = await trigger(input);
					if (current !== generation.current) return;
					source.current = input;
					setScheduled(false);
					completion.success?.(next);
				} catch (failure) {
					if (current !== generation.current) return;
					source.current = null;
					setScheduled(false);
					completion.failure?.(
						failure instanceof Error ? failure : new Error("Không thể xác nhận báo giá.")
					);
				}
			}, 300);
		},
		[invalidate, trigger]
	);
	useEffect(
		() => () => {
			generation.current += 1;
			clearTimeout(timer.current);
		},
		[]
	);
	return {
		data: replacement || data || null,
		error: error instanceof Error ? error : null,
		loading: scheduled || isMutating,
		refresh,
		invalidate,
		matches: (lines: CreativaPurchaseLine[], address: string, payment: Input["payment"]) =>
			source.current?.lines === lines &&
			source.current.address === address &&
			source.current.payment === payment,
		replace: (quote: CreativaQuote, input: Input) => {
			source.current = input;
			setReplacement(quote);
		},
	};
}
