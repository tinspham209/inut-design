/* eslint-disable camelcase */
import { Alert, Box, Button, Container, Divider, Stack, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { CreativaBreadcrumbs } from "@/components/creativa/Breadcrumbs";
import { CreativaSeo } from "@/components/creativa/Seo";
import { CreativaLayout } from "@/components/layout";
import { GUIDE_INDEX_PATH, MACBOOK_GUIDE, MACBOOK_GUIDE_PATH } from "@/data/creativa/guides";
import type { NextPageWithLayout } from "@/models/common";
import { trackCreativa } from "@/utils/creativa/analytics";

const steps = [
	{
		title: "Kiểm tra sản phẩm và chuẩn bị dụng cụ",
		image: "step-1.avif",
		imageAlt: "MacBook, miếng skin và các dụng cụ chuẩn bị trên bàn",
		paragraphs: [
			"Trước khi dán, hãy mở hộp và kiểm tra các sản phẩm đi kèm. Bộ sản phẩm có thể gồm: skin MacBook theo đơn hàng; khăn lau; nhíp nhựa hỗ trợ dán sticker phím; card thông tin sản phẩm và hướng dẫn; sticker sheet INUT Creativa.",
			"Đối chiếu mã sản phẩm, model MacBook và các phần skin với vị trí tương ứng trên máy. Đặt MacBook trên mặt bàn sạch, phẳng, đủ ánh sáng. Rửa sạch và lau khô tay trước khi bắt đầu.",
		],
	},
	{
		title: "Vệ sinh bề mặt MacBook",
		image: "step-2.avif",
		imageAlt: "Dùng khăn mềm lau bề mặt MacBook",
		paragraphs: [
			"Tắt MacBook và ngắt kết nối bộ sạc cùng các phụ kiện. Dùng khăn mềm, sạch, không xơ lau bề mặt cần dán để loại bỏ bụi và dấu vân tay. Nếu có vết bẩn khó lau, có thể dùng khăn hơi ẩm theo hướng dẫn vệ sinh của Apple, rồi đợi khô hoàn toàn.",
			"Không dán khi máy còn ẩm hoặc bám bụi. Không xịt trực tiếp nước hoặc dung dịch lên máy; tránh để hơi ẩm vào bàn phím, cổng kết nối hay khe hở.",
		],
	},
	{
		title: "Ướm thử và căn chỉnh vị trí skin",
		image: "step-3.avif",
		imageAlt: "Ướm và căn chỉnh miếng skin theo mép MacBook",
		paragraphs: [
			"Đặt miếng skin lên bề mặt MacBook khi chưa bóc giấy đế. Kiểm tra các cạnh và góc có khớp không, khoảng cách đến mép máy có đều không, vị trí khoét logo (nếu có) có trùng với logo không.",
			"Điều chỉnh đến khi xác định được vị trí phù hợp. Ưu tiên căn theo các cạnh và góc; phần logo khoét chỉ là điểm đối chiếu bổ sung.",
		],
	},
	{
		title: "Bóc một phần giấy đế và cố định mép skin",
		image: "step-4.avif",
		imageAlt: "Bóc giấy đế và căn mép miếng skin trên MacBook",
		paragraphs: [
			"Khi đã căn đúng, nhẹ nhàng bóc một đoạn nhỏ lớp giấy đế ở cạnh bắt đầu dán. Không bóc toàn bộ giấy đế ngay từ đầu. Giữ phần lớn skin trên giấy đế để tránh mặt keo vô tình chạm máy.",
			"Đưa phần skin đã bóc vào đúng vị trí; căn theo mép và hai góc rồi dùng tay ấn nhẹ cố định. Không kéo giãn hoặc giật mạnh skin, nhất là phần cắt mảnh.",
		],
	},
	{
		title: "Dán phần skin còn lại",
		image: "step-5.avif",
		imageAlt: "Kéo giấy đế và vuốt miếng skin xuống bề mặt MacBook",
		paragraphs: [
			"Sau khi cố định mép đầu tiên, tiếp tục bóc giấy đế từng đoạn nhỏ. Một tay giữ và kéo giấy đế từ từ; tay còn lại vuốt skin xuống bề mặt MacBook. Miết lần lượt từ giữa ra hai bên để đẩy không khí ra ngoài, hạn chế bọt khí và nếp nhăn.",
			"Nếu thấy lệch, hãy dừng lại. Chỉ nhẹ nhàng nhấc phần chưa miết chặt để căn lại khi chất liệu và lớp keo cho phép. Không kéo căng skin để bù vị trí lệch.",
		],
	},
	{
		title: "Miết các cạnh, góc và kiểm tra bề mặt",
		image: "step-6.avif",
		imageAlt: "Dùng khăn mềm miết góc miếng skin đã dán",
		paragraphs: [
			"Dùng đầu ngón tay hoặc khăn mềm vuốt lại toàn bộ bề mặt, đặc biệt là cạnh, góc bo và phần khoét. Nếu có bọt khí nhỏ, thử vuốt nhẹ từ bọt khí về mép gần nhất.",
			"Không sử dụng kim, vật sắc nhọn hay nhiệt trực tiếp nếu chưa được INUT xác nhận hướng dẫn cho đúng chất liệu. Nếu không xử lý được, nên dừng lại và liên hệ hỗ trợ.",
		],
	},
	{
		title: "Dán các phần skin khác (nếu có)",
		image: "step-7.avif",
		imageAlt: "Căn chỉnh miếng skin mặt đáy theo chân đế MacBook",
		paragraphs: [
			"Tùy đơn hàng, bạn có thể tiếp tục dán skin mặt đáy, kê tay hoặc trackpad. Với mỗi phần, lặp lại: vệ sinh, ướm thử, căn chỉnh, bóc giấy đế từng phần và miết hoàn thiện.",
			"Mặt đáy: chú ý chân đế, ốc vít, khe thông gió và chi tiết riêng của model. Kê tay hoặc trackpad: căn chính xác theo đường viền, tránh dán chồng lên khe hở. Chỉ dán phần có skin được thiết kế tương ứng.",
			"Nếu có sticker phím, dùng nhíp nhựa nhẹ nhàng tách từng sticker, căn đúng vị trí phím rồi ấn nhẹ. Kiểm tra chức năng phím và khả năng đóng máy.",
		],
	},
	{
		title: "Hoàn thiện và kiểm tra thành phẩm",
		image: "step-8.avif",
		imageAlt: "MacBook đã dán skin hoàn thiện",
		paragraphs: [
			"Chúc mừng! Chiếc MacBook của bạn đã có diện mạo mới.",
			"Kiểm tra skin có đúng vị trí không; bề mặt có phẳng, không nếp gấp hay bọt khí lớn không; cạnh và góc có bám chắc không; có miếng nào che cổng, khe thông gió hoặc phần chức năng không. Kiểm tra hoạt động của máy và các bộ phận liên quan trước khi dùng bình thường.",
		],
	},
];

const questions = [
	{
		question: "Lỡ dán skin bị lệch thì phải làm sao?",
		answer:
			"Nếu vừa bắt đầu dán và chưa miết chặt, bạn có thể thử nhẹ nhàng nhấc phần bị lệch để điều chỉnh, với điều kiện chất liệu và lớp keo cho phép. Không giật mạnh hay kéo căng.",
	},
	{
		question: "Skin xuất hiện bọt khí thì xử lý thế nào?",
		answer:
			"Thử dùng khăn mềm miết nhẹ từ vị trí bọt khí ra mép gần nhất. Nếu không biến mất, không nên dùng vật nhọn chọc thủng skin.",
	},
	{
		question: "Vì sao mép skin không khớp với MacBook?",
		answer:
			"Kiểm tra lại model máy và mã sản phẩm. Nếu không khớp hoặc có dấu hiệu sai kích thước, hãy ngừng dán và liên hệ INUT để được hỗ trợ.",
	},
	{
		question: "Có cần sử dụng máy sấy để dán skin không?",
		answer:
			"Với quy trình dán khô thông thường, không cần sử dụng máy sấy nếu INUT không có hướng dẫn riêng cho chất liệu bạn nhận được.",
	},
	{
		question: "Nếu vẫn không tự dán được thì sao?",
		answer:
			"Bạn có thể liên hệ INUT Creativa, gửi hình ảnh tình trạng miếng skin và model MacBook để được hướng dẫn phù hợp.",
	},
];

const Guide: NextPageWithLayout = () => (
	<>
		<CreativaSeo
			title={MACBOOK_GUIDE.title}
			path={MACBOOK_GUIDE_PATH}
			description={MACBOOK_GUIDE.description}
		/>
		<Container maxWidth="md" sx={{ py: { xs: 2, md: 3 } }}>
			<CreativaBreadcrumbs
				ancestors={[
					{ label: "Creativa", href: "/creativa" },
					{ label: "Skin MacBook", href: "/creativa/skin-laptop" },
					{ label: "Hướng dẫn sử dụng", href: GUIDE_INDEX_PATH },
				]}
				current="Tự dán skin MacBook"
			/>
			<Box component="article" sx={{ py: { xs: 1, md: 2 } }}>
				<Stack spacing={2}>
					<Typography component="h1" variant="h3" sx={{ fontSize: { xs: 32, md: 44 } }}>
						{MACBOOK_GUIDE.title}
					</Typography>
					<Typography>
						Bạn đã sẵn sàng khoác diện mạo mới cho chiếc MacBook của mình chưa?
					</Typography>
					<Typography>
						Chỉ cần một chút kiên nhẫn và thực hiện đúng các bước, bạn có thể tự dán skin MacBook
						ngay tại nhà, kể cả khi đây là lần đầu tiên.
					</Typography>
				</Stack>

				<Box component="section" sx={{ mt: 5 }}>
					<Typography component="h2" variant="h5" gutterBottom>
						Xem video hướng dẫn
					</Typography>
					<Alert severity="info">
						Video hướng dẫn đang được chuẩn bị. Bạn có thể làm theo các bước bên dưới trong khi chờ
						video.
					</Alert>
				</Box>

				<Box component="section" sx={{ mt: 5 }}>
					<Typography component="h2" variant="h4" sx={{ fontSize: { xs: 26, md: 32 } }}>
						Các bước tự dán skin MacBook
					</Typography>
					<Stack component="ol" spacing={4} sx={{ listStyle: "none", p: 0, mt: 3 }}>
						{steps.map((step, index) => (
							<Box component="li" key={step.title}>
								<Typography variant="overline" color="primary.main">
									BƯỚC {index + 1}
								</Typography>
								<Typography component="h3" variant="h5" sx={{ mb: 1.5 }}>
									{step.title}
								</Typography>
								<Stack spacing={1.5}>
									{step.paragraphs.map((paragraph) => (
										<Typography key={paragraph} sx={{ lineHeight: 1.8 }}>
											{paragraph}
										</Typography>
									))}
								</Stack>
								<Box component="figure" sx={{ m: 0, mt: 2.5, borderRadius: 2, overflow: "hidden" }}>
									<Image
										src={`/creativa/huong-dan-su-dung/cach-tu-dan-skin-macbook-tai-nha/${step.image}`}
										alt={step.imageAlt}
										width={1536}
										height={1024}
										layout="responsive"
									/>
								</Box>
							</Box>
						))}
					</Stack>
				</Box>

				<Divider sx={{ my: 5 }} />
				<Box component="section">
					<Typography component="h2" variant="h4" sx={{ fontSize: { xs: 26, md: 32 } }}>
						Câu hỏi thường gặp
					</Typography>
					<Stack spacing={3} sx={{ mt: 3 }}>
						{questions.map(({ question, answer }) => (
							<Box key={question}>
								<Typography component="h3" variant="h6" gutterBottom>
									{question}
								</Typography>
								<Typography sx={{ lineHeight: 1.8 }}>{answer}</Typography>
							</Box>
						))}
					</Stack>
				</Box>

				<Box
					component="section"
					sx={{ mt: 5, p: { xs: 2.5, md: 4 }, bgcolor: "action.hover", borderRadius: 2 }}
				>
					<Stack spacing={2} alignItems="flex-start">
						<Typography component="h2" variant="h5">
							Cảm ơn bạn đã lựa chọn INUT Creativa!
						</Typography>
						<Typography>
							Hy vọng chiếc MacBook cùng bộ skin mới sẽ mang đến thêm cảm hứng cho góc làm việc của
							bạn. Nếu cần hỗ trợ, hãy gửi hình ảnh tình trạng miếng skin và model MacBook cho INUT
							nhé.
						</Typography>
						<Link href="/contact" passHref>
							<Button
								component="a"
								variant="contained"
								onClick={() => trackCreativa("contact_click", { method: "form", surface: "guide" })}
							>
								Liên hệ hỗ trợ
							</Button>
						</Link>
					</Stack>
				</Box>
			</Box>
		</Container>
	</>
);

Guide.Layout = CreativaLayout;
export default Guide;
