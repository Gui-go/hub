const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 sm:py-6 md:py-8">
      <div className="container mx-auto px-4 text-center">
        <p className="text-xs sm:text-sm md:text-base">
          © {new Date().getFullYear()} Guigo.dev.br | Open Code, Open Mind 🚀
        </p>
      </div>
    </footer>
  );
};

export default Footer;
