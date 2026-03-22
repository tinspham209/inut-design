import { Icon, Link as MuiLink, Tooltip } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { HiDuplicate } from "react-icons/hi";
import styles from "../product/product-item.module.css";

type Props = {
	imageUrl: string;
	href: string;
	alt: string;
	onSelect?: () => void;
	priority?: boolean;
};

export function ProductCard({ imageUrl, href, alt, onSelect, priority = false }: Props) {
	return (
		<Link href={href} passHref>
			<MuiLink sx={{ position: "relative", display: "block" }} onClick={onSelect}>
				<Image
					src={imageUrl}
					width="100%"
					height="100%"
					layout="responsive"
					alt={alt}
					priority={priority}
					className={styles.productImage}
				/>
				<Tooltip title="Xem chi tiết" placement="right-end" arrow>
					<Icon
						sx={{
							position: "absolute",
							top: "8px",
							right: "8px",
						}}
					>
						<HiDuplicate color="#fff" />
					</Icon>
				</Tooltip>
			</MuiLink>
		</Link>
	);
}
