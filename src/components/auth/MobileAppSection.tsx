
export const MobileAppSection = () => {
  return (
    <div className="mt-8">
      <h3 className="text-center text-lg font-medium text-gray-800 mb-4">Teacher App</h3>
      <div className="flex items-center justify-center space-x-4">
        <img src="https://admin.studentqr.com/images/logo-my.png" alt="QR Logo" className="w-12 h-12" />
        <a href="#" className="transform hover:scale-105 transition-transform">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
            alt="Download on App Store"
            className="h-10"
          />
        </a>
        <a href="#" className="transform hover:scale-105 transition-transform">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
            alt="Get it on Google Play"
            className="h-10"
          />
        </a>
      </div>
    </div>
  );
};
