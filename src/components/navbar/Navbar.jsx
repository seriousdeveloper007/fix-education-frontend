import LoggedOutNavbar from './LoggedOutNavbar.jsx';
import PlatformNavbar from './PlatformNavbar.jsx';
import { isLoggedIn } from '../../utils/authUtils.js';

export default function Navbar() {

  return isLoggedIn() ? (
    <PlatformNavbar />
  ) : (
    <LoggedOutNavbar />
  );
}
