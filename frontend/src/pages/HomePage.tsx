import UploadPage from '../components/UploadPage';
import SEO from '../components/SEO';

export default function HomePage() {
  return (
    <>
      <SEO 
        title="Upload & Segment Images"
        description="Upload your images and get instant semantic segmentation results using state-of-the-art AI models. Free, fast, and no signup required."
        keywords="image upload, semantic segmentation, AI image analysis, free segmentation tool, deep learning"
      />
      <main 
        className="min-h-[calc(100vh-73px)]"
        role="main"
        aria-label="Image upload and segmentation"
      >
        <UploadPage />
      </main>
    </>
  );
}
