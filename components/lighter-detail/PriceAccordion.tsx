import React from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PriceTable, { PriceTier } from "./PriceTable";
import QuantitySelector from "./QuantitySelector";
import { formatPrice } from "@/utils/priceCalculator";

interface PriceAccordionProps {
	priceTiers: PriceTier[];
	quantity: number;
	setQuantity: (q: number) => void;
}

const PriceAccordion: React.FC<PriceAccordionProps> = ({ priceTiers, quantity, setQuantity }) => {
	return (
		<Accordion defaultExpanded sx={{ mb: 1 }}>
			<AccordionSummary expandIcon={<ExpandMoreIcon />}>
				<Typography fontWeight={600}>Bảng giá & Số lượng</Typography>
			</AccordionSummary>
			<AccordionDetails>
				<PriceTable priceTiers={priceTiers} formatPrice={formatPrice} />
				<QuantitySelector
					priceTiers={priceTiers}
					quantity={quantity}
					setQuantity={setQuantity}
					formatPrice={formatPrice}
				/>
			</AccordionDetails>
		</Accordion>
	);
};

export default PriceAccordion;
