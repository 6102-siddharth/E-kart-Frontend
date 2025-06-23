import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Store additional user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: email, // *Corrected: Using state variable 'email'*
        phone: phone, // *Corrected: Using state variable 'phone'*
        address: address, // *Corrected: Using state variable 'address'*
      });

      setSuccessMessage("Registration successful!");
      // Optionally redirect to login page or home page
    } catch (firebaseError) {
      setError(firebaseError.message);
      console.error("Registration error:", firebaseError);
    }
  };
  return (
            <div className="max-h-screen flex items-center justify-center bg-gray-100 py-18 px-4 sm:px-6 lg:px-8">
    <div className="container mx-auto py-8 max-w-md  space-y-8 bg-white p-10 rounded-xl shadow-lg">
      {/* Container and padding */}
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
      {/* Heading style */}
      {successMessage && (
        <p className="text-green-500 mb-2">{successMessage}</p>
      )}{" "}
      {/* Success message style */}
      {error && <p className="text-red-500 mb-2">Error: {error}</p>}{" "}
      {/* Error message style */}
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        {" "}
        {/* Form container, centered */}
        <div className="mb-4">
          {" "}
          {/* Margin bottom for spacing */}
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Email:
          </label>{" "}
          {/* Label style */}
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Password:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="phone"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Phone:
          </label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="address"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Address:
          </label>
          <textarea
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Register
        </button>
      </form>
    </div></div>
  );
}

export default RegisterPage;