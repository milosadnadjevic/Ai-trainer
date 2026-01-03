import whiteLogo from "../assets/logo.svg";
import ThemeToggle from "./ThemeToggle";

const Header = ({ onThemeChange }) => {
  return (
    <div className="flex items-start justify-between">
      <img
        src={whiteLogo}
        alt="logo"
        className="w-24 sm:w-40 drop-shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
      />
      <ThemeToggle onThemeChange={onThemeChange} />
    </div>
  );
};

export default Header;