import React from "react";
import { Stack, Button, Link as MuiLink } from "@mui/material";
import Link from "next/link";
import { AddToLighterCartButton } from "@/components/cart";
import { trackContactClick } from "@/utils/analytics";

interface ActionButtonsProps {
	lighter: any;
	lighterType: any;
	quantity: number;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ lighter, lighterType, quantity }) => (
	<Stack gap={1}>
		{lighterType && (
			<AddToLighterCartButton
				lighter={lighter}
				lighterType={lighterType}
				quantity={quantity}
				variant="contained"
				size="medium"
			/>
		)}
		<Stack flex={1} flexDirection="row" alignItems="center" gap={2} flexWrap="wrap">
			<MuiLink
				href={`https://m.me/642209429738886?text=${encodeURI(
					`I want to order lighter ${lighter.name}. Can you support me?`
				)}`}
				target="_blank"
				rel="noopener noreferrer"
				sx={{
					display: "flex",
					flexBasis: "calc(50% - 8px)",
				}}
			>
				<Button
					variant="outlined"
					color="primary"
					size="medium"
					fullWidth
					onClick={() => {
						trackContactClick("messenger", lighter.name);
					}}
				>
					Chat Messenger
				</Button>
			</MuiLink>
			<Link href="/contact" passHref>
				<MuiLink
					sx={{
						display: "flex",
						flexBasis: "calc(50% - 8px)",
					}}
				>
					<Button fullWidth variant="outlined" color="primary" size="medium">
						Liên hệ tư vấn
					</Button>
				</MuiLink>
			</Link>
		</Stack>
	</Stack>
);

export default ActionButtons;
