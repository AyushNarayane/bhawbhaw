"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const Directory = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const option = searchParams.get("option") || "seller"; // Get the `option` from the query parameter
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const options = [
    { value: "seller", label: "Sellers" },
    { value: "user", label: "Users" },
    { value: "products", label: "Products" },
  ];

  useEffect(() => {
    if (!option) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/getDataByOption?option=${option}`);
        const result = await response.json();
        if (response.ok) {
          setData(result.data);
        } else {
          setError(result.error || "An error occurred");
        }
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [option]);

  const handleOptionChange = (e) => {
    const selectedOption = e.target.value;
    router.push(`/directory?option=${selectedOption}`);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Directory</h1>

      {/* Dropdown for selecting option */}
      <div className="mb-4">
        <label htmlFor="option" className="mr-2 font-medium">
          View:
        </label>
        <select
          id="option"
          value={option}
          onChange={handleOptionChange}
          className="p-2 border rounded-md"
        >
          {options.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Data list */}
      <ul className="space-y-4">
        {data.map((item) => (
          <li key={item.id} className="border p-4 rounded-md shadow-md">
            <h2 className="text-lg font-semibold">{item.name || item.title}</h2>
            {item.email && <p>Email: {item.email}</p>}
            {item.phone && <p>Phone: {item.phone}</p>}
            {item.price && <p>Price: {item.price}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Directory;
