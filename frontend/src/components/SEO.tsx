import { Helmet } from "react-helmet-async";

interface SEOProps {
	title?: string;
	description?: string;
	keywords?: string;
	canonicalUrl?: string;
	ogImage?: string;
	ogType?: "website" | "article";
	noIndex?: boolean;
}

const SITE_NAME = "SegmentAI";
const DEFAULT_DESCRIPTION =
	"Free online semantic segmentation tool powered by deep learning. Upload images and get instant pixel-level segmentation results. No signup required.";
const DEFAULT_KEYWORDS =
	"semantic segmentation, image segmentation, deep learning, AI, machine learning, computer vision, image analysis, SegFormer, neural network";
const DEFAULT_OG_IMAGE = "/og-image.png";

export default function SEO({
	title,
	description = DEFAULT_DESCRIPTION,
	keywords = DEFAULT_KEYWORDS,
	canonicalUrl,
	ogImage = DEFAULT_OG_IMAGE,
	ogType = "website",
	noIndex = false,
}: SEOProps) {
	const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} - Free AI Image Segmentation Tool`;

	return (
		<Helmet>
			{/* Primary Meta Tags */}
			<title>{fullTitle}</title>
			<meta
				name='title'
				content={fullTitle}
			/>
			<meta
				name='description'
				content={description}
			/>
			<meta
				name='keywords'
				content={keywords}
			/>

			{/* Robots */}
			{noIndex ? (
				<meta
					name='robots'
					content='noindex, nofollow'
				/>
			) : (
				<meta
					name='robots'
					content='index, follow'
				/>
			)}

			{/* Canonical URL */}
			{canonicalUrl && (
				<link
					rel='canonical'
					href={canonicalUrl}
				/>
			)}

			{/* Open Graph / Facebook */}
			<meta
				property='og:type'
				content={ogType}
			/>
			<meta
				property='og:title'
				content={fullTitle}
			/>
			<meta
				property='og:description'
				content={description}
			/>
			<meta
				property='og:image'
				content={ogImage}
			/>
			<meta
				property='og:site_name'
				content={SITE_NAME}
			/>

			{/* Twitter */}
			<meta
				name='twitter:card'
				content='summary_large_image'
			/>
			<meta
				name='twitter:title'
				content={fullTitle}
			/>
			<meta
				name='twitter:description'
				content={description}
			/>
			<meta
				name='twitter:image'
				content={ogImage}
			/>

			{/* Additional SEO */}
			<meta
				name='author'
				content='SegmentAI Team'
			/>
			<meta
				name='application-name'
				content={SITE_NAME}
			/>
			<meta
				name='theme-color'
				content='#14b8a6'
			/>
		</Helmet>
	);
}
