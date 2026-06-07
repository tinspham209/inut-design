import { HeaderDesktop } from "./header-desktop";
import { HeaderMobile } from "./header-mobile";
import { CREATIVA_ROUTE_LIST } from "./routes";

export function Header() {
	return (
		<>
			<HeaderMobile />
			<HeaderDesktop />
		</>
	);
}

export function CreativaHeader() {
	return (
		<>
			<HeaderMobile routes={CREATIVA_ROUTE_LIST} />
			<HeaderDesktop routes={CREATIVA_ROUTE_LIST} />
		</>
	);
}
