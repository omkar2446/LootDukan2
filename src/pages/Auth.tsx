import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "@/lib/adminAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const success = loginAdmin(email, password);

    if (success) {
      alert("Login successful");
      navigate("/");
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-lg shadow-md w-[350px]"
      >
        <h2 className="text-xl font-bold mb-4">Admin Login</h2>

        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-3"
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4"
        />

        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
    </div>
  );
}
