import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { setSelectedService } from "@/redux/serviceSlice";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

export default function Services() {
  const [services, setServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("/api/services/getAllServices")
      .then((response) => response.json())
      .then((data) => {
        setServices(data.filter(service => service.status === 'verified'));
        const uniqueCategories = [
          "All",
          ...new Set(data.filter(service => service.status === 'verified').map((item) => item.serviceType)),
        ];
        setCategories(uniqueCategories);
      })
      .catch((error) => console.error("Error fetching services:", error));
  }, []);

  // console.log(services);

  const filteredServices =
    selectedCategory === "All"
      ? services
      : services.filter((service) => service.serviceType === selectedCategory);

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen py-16 px-4 font-prompt">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold mb-16 text-gray-800 text-center">
          Our <span className="text-red-500">Services</span>
        </h1>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Categories */}
          <aside className="w-full md:w-1/4 bg-white p-8 shadow-xl rounded-2xl !min-h-[28rem] mb-6 md:mb-0">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Categories
            </h2>
            <ul className="space-y-4">
              {categories.map((category) => (
                <li
                  key={category}
                  className={`relative pl-4 cursor-pointer font-medium text-lg transition-all duration-300 ${
                    selectedCategory === category
                      ? "text-red-500 font-semibold"
                      : "text-gray-600 hover:text-red-400"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  <span
                    className={`absolute left-0 top-1/2 -translate-y-1/2 h-8 border-l-4 transition-all duration-300 ${
                      selectedCategory === category
                        ? "border-red-500"
                        : "border-transparent"
                    }`}
                  ></span>
                  {category}
                </li>
              ))}
            </ul>
          </aside>

          {/* Services Grid */}
          <div className="flex-1 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service, index) => (
              <ServiceCard key={service.createdAt || index} service={service} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ServiceCard({ service }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const userId = useSelector((state) => state.user.userId);

  const handleBookNow = () => {
    if (!userId) {
      toast.error("Please log in to proceed with booking.");
      router.push('/signin')
      return;
    }
    dispatch(setSelectedService(service));
    router.push("/service-providers");
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
      <Toaster />

      {/* Popular Badge */}
      <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-semibold rounded-full px-4 py-1.5 z-10">
        Popular
      </span>

      {/* Service Image */}
      <div className="relative h-56 overflow-hidden">
        <Image
          height={300}
          width={400}
          src={service.imageUrl || "/placeholder.webp"}
          alt={service.specialization}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {service.specialization}
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          {service.serviceType}
        </p>

        {/* Price */}
        <p className="text-xl font-bold text-green-600 mb-4">
          Rs {service.expectedSalary}/hr
        </p>

        {/* Rating */}
        <div className="flex items-center mb-6">
          <div className="flex text-yellow-400">
            {"⭐".repeat(4)}
          </div>
          <span className="text-gray-500 text-sm ml-2">(21 reviews)</span>
        </div>

        {/* Book Now Button */}
        <button
          onClick={handleBookNow}
          className="w-full bg-red-500 text-white text-lg py-3 rounded-xl hover:bg-red-600 transition-colors duration-300 font-semibold transform hover:-translate-y-1"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
