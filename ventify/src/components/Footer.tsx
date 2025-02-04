import { MdEmail, MdPhone } from "react-icons/md";
import { FaLinkedin, FaFacebook, FaTwitter } from "react-icons/fa";
const Footer = () => {
  return (
    <section className="bg-[#00B38F] text-white py-10 justify-center items-center flex flex-col gap-5">
      <p>Connect with us</p>
      <div className="flex gap-4 justify-center items-center">
        <MdPhone size={20} />
        <p>Phone: +2341123456789</p>
      </div>

      <div className="flex justify-end w-full">
        <div className="w-1/3"></div>
        <div className="w-1/3 flex gap-4 justify-center items-center">
          <MdEmail size={20} />
          <p>
            Email:{" "}
            <a className="hover:underline" href="#">
              support@ventify.com
            </a>
          </p>
        </div>
        <div className="flex w-1/3 justify-end mr-10 gap-3">
          <FaFacebook size={20} />
          <FaLinkedin size={20} />
          <FaTwitter size={20} />
        </div>
      </div>
    </section>
  );
};

export default Footer;
