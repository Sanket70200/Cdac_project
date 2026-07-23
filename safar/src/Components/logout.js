import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "./slice";

export default function Logout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  console.log("Logging out");
  localStorage.clear("userDetails");
  dispatch(logout()); // Clear Redux state
  navigate("/");
}
