import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {

      setLoading(true);

      const { data } = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      localStorage.setItem("userInfo", JSON.stringify(data));

      setLoading(false);

      navigate("/");

    } catch (error) {

      setLoading(false);

      alert(
        error.response?.data?.message || "Login failed"
      );
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-b from-[#f8faff] to-white flex flex-col pt-16">

        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12 sm:py-16">

          <div className="w-full max-w-md relative group">

            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition duration-300"></div>

            <form
              onSubmit={submitHandler}
              className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-200"
            >

              <div className="flex border-b border-gray-200 mb-8">

                <button className="flex-1 text-center font-semibold text-blue-600 border-b-2 border-blue-600 pb-3">
                  Log In
                </button>

                <Link
                  to="/register"
                  className="flex-1 text-center font-semibold text-gray-400 hover:text-blue-600 pb-3"
                >
                  Sign Up
                </Link>

              </div>

              <h2 className="text-3xl font-bold text-center mb-6">
                Welcome back
              </h2>

              <div className="mb-4">

                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-2 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder="john@gmail.com"
                />

              </div>

              <div className="mb-6">

                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>

                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full mt-2 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                />

              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-600 to-cyan-600"
              >
                {loading ? "Logging in..." : "Log In"}
              </button>

              <p className="text-center mt-6 text-sm text-gray-600">

                Don't have an account?{" "}

                <Link
                  to="/register"
                  className="text-blue-600 font-semibold"
                >
                  Sign up
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