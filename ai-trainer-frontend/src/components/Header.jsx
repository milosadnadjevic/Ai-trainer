import whiteLogo from "../assets/logo.svg";
import blueLogo from '../assets/purple.svg';

const Header = ({ isDarkMode }) => {
  return (
    <div className="flex justify-center">
      <img
        src={isDarkMode ? whiteLogo : blueLogo}
        alt="logo"
        className="w-36 sm:w-40 drop-shadow-[0_10px_30px_rgba(255,255,255,0.15)]"
      />
    </div>
  );
};

export default Header;