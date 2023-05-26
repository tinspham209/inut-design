import { HeaderDesktop } from "./header-desktop";
import { HeaderMobile } from "./header-mobile";
type Props = {
	isAuthenticated: boolean;
};
export function Header({ isAuthenticated }: Props) {
	return (
		<>
			<HeaderMobile isAuthenticated={isAuthenticated} />
			<HeaderDesktop isAuthenticated={isAuthenticated} />
		</>
	);
}
