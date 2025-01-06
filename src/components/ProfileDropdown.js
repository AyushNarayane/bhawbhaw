import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { clearUser } from "@/redux/userSlice";
import Link from "next/link";
import Image from "next/image";

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const onLogout = () => {
    dispatch(clearUser());
    localStorage.removeItem("user");
    sessionStorage.removeItem('reloadDone')
    location.reload()
    router.push("/signin");
  };

  return (
    <div className="relative z-50">
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300"
      >
        <Image
          src="/images/navbar/profile.png"
          height={50}
          width={50}
          alt="Profile"
          className="w-6 h-6"
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200">
          <div className="py-2">
            <Link href="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
              Profile
            </Link>
            <Link href="/saved-addresses" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
              Saved Address
            </Link>
            <Link href="/my-orders" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
              Orders
            </Link>
            <button
              onClick={onLogout}
              className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
