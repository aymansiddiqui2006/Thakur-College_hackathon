import { useState } from "react";
import API from "./api";

function Register() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/register", user);

      alert("Registration Successful");
      console.log(res.data);

    } catch (error) {
      alert("Registration Failed");
      console.error(error.response?.data || error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          User Registration
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
          value={user.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
          value={user.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
          value={user.password}
          onChange={handleChange}
          required
        />

        <select
          name="role"
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
          value={user.role}
          onChange={handleChange}
        >
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
        </select>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
