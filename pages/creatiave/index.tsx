import { GetServerSideProps } from "next";

const CreatiaveRedirectPage = () => null;

export const getServerSideProps: GetServerSideProps = async () => {
	return {
		redirect: {
			destination: "/creativa",
			permanent: true,
		},
	};
};

export default CreatiaveRedirectPage;
