import { create } from "zustand";
import { DIALOG_TYPES, DialogData, DialogDataKey } from "./type";
import _ from "lodash";
import { Callback } from "@/utils";

export interface IDialogState {
	isVisible: {
		[key: DialogDataKey | string]: boolean;
	};
	type: {
		[key: DialogDataKey | string]: string;
	};
	data: {
		[key: DialogDataKey | string]: DialogData;
	};
	loading: {
		[key: DialogDataKey | string]: boolean;
	};
}

type ShowDialogType = {
	data: DialogData;
	type: DIALOG_TYPES;
};
interface IDialogActions {
	hideDialog: Callback;
	hideAllDialog: Callback;
	// eslint-disable-next-line no-unused-vars
	showDialog: ({ data, type }: ShowDialogType) => void;
}

const useDialogSlice = create<IDialogState & IDialogActions>(
	(set): IDialogState & IDialogActions => ({
		isVisible: {},
		type: {},
		data: {},
		loading: {},
		hideDialog: () =>
			set((state) => {
				const _state = _.cloneDeep(state);
				const keys = Object.keys(_state.isVisible);
				const newKey = Object.values(DialogDataKey)[keys.length - 1];
				delete _state.isVisible[newKey];
				return { ..._state };
			}),
		hideAllDialog: () =>
			set(() => {
				return {
					isVisible: {},
					type: {},
					data: {},
					loading: {},
				};
			}),

		showDialog: ({ data, type }) =>
			set((state) => {
				const _state = _.cloneDeep(state);
				const keys = Object.keys(_state.isVisible);
				const newKey = Object.values(DialogDataKey)[keys.length];

				_state.data = {
					..._state.data,
					[newKey]: data,
				};

				_state.type = {
					..._state.type,
					[newKey]: type,
				};
				_state.isVisible = {
					..._state.isVisible,
					[newKey]: true,
				};

				return { ..._state };
			}),
	})
);

export default useDialogSlice;
