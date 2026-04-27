import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Register() {

  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {

    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const fullName = `${firstName} ${lastName}`;

    try {

      setLoading(true);

      const { data } = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          fullName,
          email,
          password,
        }
      );

      localStorage.setItem("userInfo", JSON.stringify(data));

      setLoading(false);

      navigate("/");

    } catch (error) {

      setLoading(false);

      alert(
        error.response?.data?.message || "Registration failed"
      );

    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-b from-[#f8faff] to-white flex flex-col pt-16">

        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12 sm:py-16">

          <div className="w-full max-w-md relative group">

            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur-xl opacity-20"></div>

            <form
              onSubmit={submitHandler}
              className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-200"
            >

              <h2 className="text-3xl font-bold text-center mb-6">
                Create Account
              </h2>

              <div className="mb-4">

                <label className="text-sm font-medium text-gray-700">
                  First Name
                </label>

                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full mt-2 px-4 py-3 border rounded-xl"
                />

              </div>

              <div className="mb-4">

                <label className="text-sm font-medium text-gray-700">
                  Last Name
                </label>

                <input
                  type="text"
                  value={lastName}
                  placeholder="Max"
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full mt-2 px-4 py-3 border rounded-xl"
                />

              </div>

              <div className="mb-4">

                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-2 px-4 py-3 border rounded-xl"
                />

              </div>

              <div className="mb-4">

                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>

                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full mt-2 px-4 py-3 border rounded-xl"
                />

              </div>

              <div className="mb-6">

                <label className="text-sm font-medium text-gray-700">
                  Confirm Password
                </label>

                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full mt-2 px-4 py-3 border rounded-xl"
                />

              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-600 to-cyan-600"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>

              <p className="text-center mt-6 text-sm text-gray-600">

                Already have an account?{" "}

                <Link
                  to="/login"
                  className="text-blue-600 font-semibold"
                >
                  Log In
                </Link>

              </p>

            </form>

          </div>

        </main>

        <Footer />

      </div>
    </>
  );
}