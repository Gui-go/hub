import { useEffect, useState } from "react";

const CookieConsentBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookie_consent");
    if (!accepted) setVisible(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie_consent", "true");
    setVisible(false);
    window.location.reload(); // Reload to inject analytics
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
      <div className="bg-white text-gray-800 p-6 rounded-xl shadow-2xl max-w-md w-full animate-fade-in">
        <h2 className="text-lg font-semibold mb-2">This website uses cookies. 🍪</h2>
        <p className="text-lg mb-4">
          You're already here, so let's be honest: we're not letting you leave without a little data exchange. Think of it as a beautifully symbiotic relationship where we get insights and you get... well, this website. By clicking "Accept," you're not just agreeing to analytics; you're embracing your role in our grand digital experiment. Resistance is, frankly, futile (and far less convenient).
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleAccept}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
