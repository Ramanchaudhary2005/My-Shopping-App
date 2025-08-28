import { FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="mt-8 border-t bg-zinc-900 text-zinc-200">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-sm">Made by <span className="font-semibold">Raman Kumar</span></div>
        <a
          href="https://www.linkedin.com/in/raman-kumar-5a6a61343/"
          target="_blank"
          rel="noreferrer noopener"
          className="flex items-center gap-2 hover:text-white"
          aria-label="Raman Kumar on LinkedIn"
        >
          <FaLinkedin size={20} />
          <span className="text-sm">LinkedIn</span>
        </a>
      </div>
    </footer>
  );
};

export { Footer };


