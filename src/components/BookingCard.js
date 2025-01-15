import Image from "next/image";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "firebaseConfig";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const BookingCard = ({ booking }) => {
  const [bookingStatus, setBookingStatus] = useState(booking.status);
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewData, setReviewData] = useState({
    stars: 0,
    image: null,
    message: "",
    title: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isTimeSlotPassed = () => {
    const currentDate = new Date();
    const [startTime] = booking.calendarAndSlot.timeSlot.split(" - ");
    const bookingTime = new Date(`${booking.calendarAndSlot.date} ${startTime}`);
    return currentDate > bookingTime;
  };

  const markAsCompleted = async () => {
    if (!isTimeSlotPassed()) {
      toast.error("You can only mark this as completed after the time slot.");
      return;
    }

    try {
      const bookingRef = doc(db, "bookings", booking.id);
      await updateDoc(bookingRef, { status: "completed" });
      setBookingStatus("completed");
      toast.success("Booking marked as completed!");
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast.error("Failed to update booking status.");
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return null;
    try {
      const fileRef = ref(storage, `reviews/${booking.id}/${file.name}`);
      await uploadBytes(fileRef, file);
      return await getDownloadURL(fileRef);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload image.");
      return null;
    }
  };

  const handleSubmitReview = async () => {
    try {
      setIsSubmitting(true);
      toast.loading("Submitting review...");

      let imageUrl = null;
      if (reviewData.image) {
        imageUrl = await handleFileUpload(reviewData.image);
      }

      const newReview = {
        stars: reviewData.stars,
        title: reviewData.title,
        message: reviewData.message,
        image: imageUrl,
        createdAt: new Date().toISOString(),
      };

      // Fetch existing reviews
      const bookingRef = doc(db, "bookings", booking.id);
      const bookingDoc = await getDoc(bookingRef);
      let existingReviews = [];
      if (bookingDoc.exists()) {
        existingReviews = bookingDoc.data().reviews || [];
      }

      // Add the new review to the existing reviews array
      const updatedReviews = [...existingReviews, newReview];

      // Update the reviews array in Firestore
      await updateDoc(bookingRef, { reviews: updatedReviews });

      toast.dismiss();
      toast.success("Review submitted successfully!");
      setReviewData({
        stars: 1,
        title: "",
        message: "",
        image: null,
      });
      setReviewModalOpen(false)
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.dismiss();
      toast.error("Failed to submit review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col bg-white shadow-md hover:shadow-lg transition-shadow rounded-lg p-6 mb-4 font-montserrat text-black mx-2">
      <Toaster />
      <p className="text-sm font-semibold mb-2">BOOKING ID: {booking.bookingID}</p>
      <div className="w-full flex flex-col md:flex-row">
        {/* Left Section */}
        <div className="flex flex-col md:flex-row md:space-x-6 items-center">
          <Image
            width={500}
            height={500}
            src={booking.selectedService?.image?.[0] || "/images/common/dummy.png"}
            alt={booking.selectedService?.title || "Service"}
            className="w-40 h-40 object-cover rounded-md"
          />
          <div className="mt-4 md:mt-0 md:ml-4">
            <h2 className="text-md font-bold">{booking.selectedService?.title}</h2>
            <p className="text-sm">
              <span className="text-[#676767]">SERVICE NAME: </span>
              <span className="font-semibold text-black">{booking.selectedService?.serviceName}</span>
            </p>
            <p className="text-sm">
              <span className="text-[#676767]">ADDRESS: </span>
              <span className="font-semibold text-black">{booking.selectedService?.address}</span>
            </p>
            <p className="text-sm">
              <span className="text-[#676767]">PRICE PER HOUR: </span>
              <span className="font-semibold text-black">₹{booking.selectedService?.pricePerHour || "N/A"}</span>
            </p>
            <p className="text-sm">
              <span className="text-[#676767]">STATUS: </span>
              <span className={`font-semibold ${bookingStatus === "incoming" ? "text-green-600" : "text-red-600"}`}>
                {bookingStatus.toUpperCase()}
              </span>
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="ml-auto flex">
          <div className="mt-4 md:mt-0 flex flex-col items-end justify-between">
            <div className="text-right">
              <p className="text-sm text-[#676767]">
                BOOKED AT:
                <span className="font-semibold text-black">
                  {" "}
                  {new Date(booking.selectedService?.createdAt).toLocaleDateString()}
                </span>
              </p>
              <p className="text-sm text-[#676767]">
                CONTACT:
                <span className="font-semibold text-black"> {booking.contactInfo?.phoneNumber || "N/A"}</span>
              </p>
            </div>
            {bookingStatus === "incoming" && (
              <button
                onClick={markAsCompleted}
                className="bg-green-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-green-600"
              >
                Mark as Completed
              </button>
            )}
            {bookingStatus === "completed" && (
              <button
                onClick={() => setReviewModalOpen(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-blue-600"
              >
                Give Review
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-md:w-11/12">
            <h2 className="text-lg font-bold mb-4">Submit Your Review</h2>
            <label className="block mb-2">
              Stars:
              <input
                type="number"
                min="1"
                max="5"
                value={reviewData.stars}
                onChange={(e) => setReviewData({ ...reviewData, stars: parseInt(e.target.value, 10) })}
                className="border border-gray-300 rounded px-2 py-1 w-full"
                onKeyDown={(e) => e.preventDefault()}
              />
            </label>
            <label className="block mb-2">
              Title:
              <input
                type="text"
                value={reviewData.title}
                onChange={(e) => setReviewData({ ...reviewData, title: e.target.value })}
                className="border border-gray-300 rounded px-2 py-1 w-full"
              />
            </label>
            <label className="block mb-2">
              Message:
              <textarea
                value={reviewData.message}
                onChange={(e) => setReviewData({ ...reviewData, message: e.target.value })}
                className="border border-gray-300 rounded px-2 py-1 w-full"
              ></textarea>
            </label>
            <label className="block mb-2">
              Image (optional):
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setReviewData({ ...reviewData, image: e.target.files[0] })}
                className="border border-gray-300 rounded px-2 py-1 w-full"
              />
            </label>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setReviewModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                disabled={isSubmitting}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingCard;