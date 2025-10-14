import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type LayoutView = "grid" | "list";

interface LightersLayoutStore {
	layoutView: LayoutView;
	setLayoutView: (view: LayoutView) => void;
	toggleLayoutView: () => void;
}

/**
 * Lighters Layout Store
 * Manages layout view preference (grid/list) with localStorage persistence
 * Storage key: 'inut-lighters-layout'
 */
const useLightersLayout = create<LightersLayoutStore>()(
	persist(
		(set) => ({
			// ==================== State ====================
			layoutView: "grid",

			// ==================== Actions ====================

			/**
			 * Set the layout view
			 */
			setLayoutView: (view) => {
				set({ layoutView: view });
			},

			/**
			 * Toggle between grid and list view
			 */
			toggleLayoutView: () => {
				set((state) => ({
					layoutView: state.layoutView === "grid" ? "list" : "grid",
				}));
			},
		}),
		{
			name: "inut-lighters-layout", // localStorage key
			storage: createJSONStorage(() => localStorage),
		}
	)
);

export default useLightersLayout;
