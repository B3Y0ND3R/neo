import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/home/layout";
import notFoundVideo from "@/assets/404.mp4"; // Update path to your video

function NotFound() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-64 object-contain"
          >
            <source src={notFoundVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <h1 className="mt-6 text-4xl font-extrabold text-gray-900 animate-pulse">
            404 - Page Not Found
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Oops! The page you're looking for doesn't exist.
          </p>
          <div className="mt-6">
            <Button
              onClick={() => navigate("/")}
              className="transform transition-transform duration-200 hover:scale-105"
            >
              Return Home
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default NotFound;