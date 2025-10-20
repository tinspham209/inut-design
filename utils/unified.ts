import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeDocument from "rehype-document";
import rehypeFormat from "rehype-format";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkImages from "remark-images";
import remarkParse from "remark-parse";
import remarkPrism from "remark-prism";
import remarkRehype from "remark-rehype";
import remarkToc from "remark-toc";
import { unified } from "unified";

export const getVFile = async (
	file: string,
	{
		title,
	}: {
		title: string;
	}
) => {
	return await unified()
		.use(remarkParse)
		.use(remarkGfm)
		.use(remarkToc, { heading: "Table of Contents" })
		// .use(remarkPrism, { plugins: ['line-numbers'] })
		.use(remarkPrism)
		.use(remarkImages)
		.use(remarkRehype)
		.use(rehypeSlug)
		.use(rehypeAutolinkHeadings, { behaviour: "wrap" })
		.use(rehypeDocument, { title })
		.use(rehypeFormat)
		.use(rehypeStringify)
		.process(file || "");
};
