import whiteLogo from "../assets/logo.svg";

const Header = () => {
  return (
    <div className="flex justify-center">
      <img
        src={whiteLogo}
        alt="logo"
        className="w-36 sm:w-40 drop-shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
      />
    </div>
  );
};

export default Header;