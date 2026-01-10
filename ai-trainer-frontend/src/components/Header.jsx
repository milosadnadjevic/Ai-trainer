import logo from "../assets/bodycode-red-gradient.svg";

const Header = () => {
  return (
    <div className="flex items-center justify-baseline py-1">
      <img
        src={logo}
        alt="logo"
        className="w-40 sm:w-40 drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
      />
    </div>
  );
};

export default Header;