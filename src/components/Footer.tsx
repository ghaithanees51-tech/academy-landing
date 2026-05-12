import {
  footerData,
} from "@/data/footerData";

const Footer = () => {
  return (
    <footer dir="rtl" className="bg-primary text-white hidden md:block">    
      <div className="border-t border-white/10 py-4">
        <p className="text-center text-base text-white/60">
          {footerData.copyrightPrefix} {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
};

export default Footer;