import Image from "next/image";
import { useEffect, useRef } from "react";

const Popup = ({ imageSrc, title, message, closePopup }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closePopup();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closePopup]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50" onClick={closePopup}>
      <div ref={modalRef} className="bg-white p-8 rounded-lg shadow-lg relative" onClick={(e) => e.stopPropagation()}>
        <button
          className="absolute top-2 right-2"
          onClick={closePopup}
          aria-label="Close popup"
        >
          <Image
            height={50}
            width={50}
            src="/images/services/cross.png"
            alt="Close"
            className="size-4 m-1"
          />
        </button>
        <div className="flex flex-col mx-32 my-3 items-center">
          <Image
            height={50}
            width={50}
            src={imageSrc}
            alt="Icon"
            className="size-32 mb-7"
          />
          <h3 className="text-lg font-semibold mb-2 mx-auto">{title}</h3>
          <p>{message}</p>
          <button
            className="mt-4 bg-[#E57A7A] text-white px-4 py-2 rounded"
            onClick={closePopup}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
