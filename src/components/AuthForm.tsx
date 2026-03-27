import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

interface AuthFormProps {
  onLogin: (email: string, password: string) => boolean;
}

export function AuthForm({ onLogin }: AuthFormProps) {
  const [role, setRole] = useState<"admin" | "reader">("reader");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!onLogin(email, password)) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-blue-600">
            <span className="text-2xl font-bold text-white">R</span>
          </div>
          <CardTitle className="text-2xl font-semibold text-slate-900">
            Welcome to ReadHub
          </CardTitle>
          <CardDescription className="text-slate-500">
            Sign in to access your reading library
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label className="text-sm font-medium text-slate-700">Select Role</Label>
              <RadioGroup
                value={role}
                onValueChange={(v) => setRole(v as "admin" | "reader")}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="reader" id="reader" />
                  <Label htmlFor="reader" className="cursor-pointer font-normal">
                    Reader
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="admin" id="admin" />
                  <Label htmlFor="admin" className="cursor-pointer font-normal">
                    Admin
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder={role === "admin" ? "admin@readhub.com" : "user@readhub.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-slate-700">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder={role === "admin" ? "admin123" : "user123"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <Button type="submit" className="h-11 w-full bg-blue-600 hover:bg-blue-700">
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}