"use client";

import { MainLayout } from "@/components/layout";
import ActionButtons from "@/components/orderTracking/lighters/ActionButtons";
import BankTransferInfo from "@/components/orderTracking/lighters/BankTransferInfo";
import ContactInfo from "@/components/orderTracking/lighters/ContactInfo";
import CustomerInfoCard from "@/components/orderTracking/lighters/CustomerInfoCard";
import ErrorState from "@/components/orderTracking/lighters/ErrorState";
import LoadingState from "@/components/orderTracking/lighters/LoadingState";
import OrderInfoCard from "@/components/orderTracking/lighters/OrderInfoCard";
import OrderItemsList from "@/components/orderTracking/lighters/OrderItemsList";
import SuccessHeader from "@/components/orderTracking/lighters/SuccessHeader";
import { useOrderByNumber } from "@/hooks/useOrderByNumber";
import { usePrimaryBankInfo } from "@/hooks/usePrimaryBankInfo";
import { NextPageWithLayout } from "@/models/common";
import { Box, Container } from "@mui/material";
import { useRouter } from "next/router";

const LighterOrderConfirmation: NextPageWithLayout = () => {
	const router = useRouter();
	const { slug, justOrdered } = router.query;
	const showSuccess = justOrdered === "1";
	const { data: orderData, error: orderError, isLoading: loadingOrder } = useOrderByNumber(slug);
	const shouldFetchBank = orderData?.paymentMethod === "bank_transfer";
	const { data: bankInfo, isLoading: loadingBankInfo } = usePrimaryBankInfo(!!shouldFetchBank);

	const showBankInfo =
		(shouldFetchBank && orderData?.paymentStatus === "pending") ||
		orderData?.paymentStatus === "failed";

	// Loading state
	if (loadingOrder) {
		return <LoadingState />;
	}

	// Error state
	if (orderError || !orderData) {
		return <ErrorState error={orderError?.message} />;
	}

	return (
		<Box component="section" bgcolor="secondary.dark" minHeight="100vh" py={4}>
			<Container maxWidth="md">
				{showSuccess && <SuccessHeader customerName={orderData.customerName} />}

				<Box mb={3}>
					<OrderInfoCard
						orderNumber={orderData.orderNumber}
						orderDate={orderData.orderDate}
						status={orderData.status}
						paymentStatus={orderData.paymentStatus}
						trackingNumber={orderData?.trackingNumber}
					/>
				</Box>
				<Box mb={3}>
					<CustomerInfoCard
						name={orderData.customerName}
						phone={orderData.customerPhone}
						email={orderData.customerEmail}
						address={orderData.deliveryAddress}
						paymentMethod={orderData.paymentMethod}
						notes={orderData.notes}
					/>
				</Box>
				{orderData.paymentMethod === "bank_transfer" && (
					<Box mb={3}>
						{loadingBankInfo ? (
							<LoadingState />
						) : (
							bankInfo &&
							showBankInfo && (
								<BankTransferInfo
									bankInfo={bankInfo}
									totalAmount={orderData.totalAmount}
									customerPhone={orderData.customerPhone}
								/>
							)
						)}
					</Box>
				)}
				<Box mb={3}>
					<OrderItemsList items={orderData.orderItems} totalAmount={orderData.totalAmount} />
				</Box>
				<ActionButtons />
				<ContactInfo />
			</Container>
		</Box>
	);
};

LighterOrderConfirmation.Layout = MainLayout;

export default LighterOrderConfirmation;
