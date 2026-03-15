"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLoginForm } from "../hooks/useLoginForm";

export function LoginForm() {
  const { phone, setPhone, password, setPassword, loading, error, handleLogin } = useLoginForm();

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <label
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          htmlFor="phone"
        >
          Phone Number
        </label>
        <Input
          id="phone"
          placeholder="0771234567"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <label
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          htmlFor="password"
        >
          Password
        </label>
        <Input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <p className="text-sm text-red-500 text-center">{error}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}
