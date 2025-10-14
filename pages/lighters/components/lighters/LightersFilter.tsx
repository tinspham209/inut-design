import { LighterType } from "@/models/cart";
import { COLOR_CODE } from "@/utils";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	FormControl,
	FormControlLabel,
	Radio,
	RadioGroup,
	Stack,
	Typography,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { useRouter } from "next/router";
import React from "react";

interface LightersFilterProps {
	lighterTypes: LighterType[];
}

const LightersFilter: React.FC<LightersFilterProps> = ({ lighterTypes }) => {
	const router = useRouter();
	const { filter } = router.query;
	const theme = useTheme();
	const isMobileScreen = useMediaQuery(theme.breakpoints.down("md"));

	const [expandedFilter, setExpandedFilter] = React.useState<boolean>(true);
	const [currentFilter, setCurrentFilter] = React.useState(filter || "");

	React.useEffect(() => {
		if (isMobileScreen) {
			setExpandedFilter(false);
		} else {
			setExpandedFilter(true);
		}
	}, [isMobileScreen]);

	React.useEffect(() => {
		setCurrentFilter(filter || "");
	}, [filter]);

	const handleOnChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = (event.target as HTMLInputElement).value;
		setCurrentFilter(value);
		router.push(
			{
				pathname: "/lighters",
				query: { filter: value },
			},
			undefined,
			{ scroll: false }
		);

		setTimeout(() => {
			document
				.getElementById("title")
				?.scrollIntoView({ behavior: "smooth", block: "start", inline: "start" });
		}, 500);
	};

	const handleExpandChange = () => {
		setExpandedFilter(!expandedFilter);
	};

	return (
		<Box
			sx={{
				width: "100%",
				borderRadius: 16,
			}}
		>
			<Accordion
				expanded={expandedFilter}
				onChange={handleExpandChange}
				TransitionProps={{ unmountOnExit: true }}
				sx={{
					position: {
						md: "sticky",
					},
					top: {
						md: "90px",
					},
					right: {
						md: 0,
					},
					minHeight: {
						md: "1px",
					},
					maxHeight: {
						xs: "100%",
						md: "80vh",
					},
					overflowY: {
						xs: "none",
						md: "auto",
					},
					border: `1px solid ${COLOR_CODE.BORDER}`,
					borderRadius: "8px 4px 4px 8px !important",
				}}
			>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon color="primary" />}
					aria-controls="panel1a-content"
					id="panel1a-header"
				>
					<Typography variant="h4" fontWeight="bold">
						Bộ lọc
					</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<Stack flexDirection="column">
						<FormControl>
							<RadioGroup
								name="radio-buttons-filters"
								value={currentFilter}
								onChange={handleOnChangeCheckbox}
							>
								<FormControlLabel value={""} control={<Radio />} label={"Tất cả"} />
								{lighterTypes.map((lighterType) => {
									return (
										<FormControlLabel
											key={lighterType._id}
											value={lighterType.slug.current}
											control={<Radio />}
											label={lighterType.name}
										/>
									);
								})}
							</RadioGroup>
						</FormControl>
					</Stack>
				</AccordionDetails>
			</Accordion>
		</Box>
	);
};

export default LightersFilter;
