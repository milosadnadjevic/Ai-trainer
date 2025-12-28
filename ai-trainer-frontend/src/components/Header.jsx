import logo from "../assets/anatomija-logo.svg";

const Header = () => {
  return (
    <div className="flex justify-center">
      <img
        src={logo}
        alt="logo"
        className="w-36 sm:w-40 drop-shadow-[0_10px_30px_rgba(255,255,255,0.15)]"
      />
    </div>
  );
};

export default Header;
