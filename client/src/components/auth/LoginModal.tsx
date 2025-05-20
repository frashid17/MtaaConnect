import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuthActions } from "@/hooks/use-auth";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignupClick: () => void;
}

export default function LoginModal({ isOpen, onClose, onSignupClick }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { login, loginWithGoogle, isLoading } = useAuthActions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      onClose();
      setEmail("");
      setPassword("");
    }
  };

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
    // No need to close modal as we're redirected
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle>Login to MTAA CONNECT</DialogTitle>
        <DialogDescription>
          Access your account to join events, participate in harambees, and more.
        </DialogDescription>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember-me"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(!!checked)}
              />
              <Label htmlFor="remember-me" className="text-sm">Remember me</Label>
            </div>
            <Button variant="link" className="p-0 h-auto text-sm">
              Forgot password?
            </Button>
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <svg
              className="mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 186.69 190.5"
              fill="currentColor"
            >
              <path
                d="M95.25 77.932v36.888h51.262c-2.251 11.863-9.006 21.908-19.137 28.663l30.913 23.986c18.011-16.63 28.402-41.07 28.402-70.251 0-6.753-.606-13.249-1.732-19.5z"
                fill="#4285f4"
              />
              <path
                d="M41.869 113.038l-6.972 5.337-24.679 19.223c15.673 31.086 47.796 52.561 85.03 52.561 25.717 0 47.278-8.486 63.038-23.033l-30.913-23.986c-8.486 5.715-19.31 9.179-32.125 9.179-24.765 0-45.806-16.712-53.34-39.226z"
                fill="#34a853"
              />
              <path
                d="M41.869 77.932c-3.091 9.065-4.84 18.659-4.84 28.663 0 10.004 1.749 19.598 4.84 28.663l31.651-24.56c-1.984-5.521-3.121-11.475-3.121-17.777s1.137-12.256 3.121-17.777z"
                fill="#fbbc05"
              />
              <path
                d="M95.25 44.544c12.149 0 23.15 4.17 31.75 12.37l27.509-27.509C139.178 15.651 118.988 8 95.25 8c-37.234 0-69.359 21.475-85.032 52.561l31.652 24.57c7.533-22.514 28.574-39.226 53.339-39.226z"
                fill="#ea4335"
              />
            </svg>
            Continue with Google
          </Button>
        </form>
        
        <div className="text-center text-sm">
          Don't have an account?{" "}
          <Button
            variant="link"
            className="p-0 h-auto"
            onClick={() => {
              onClose();
              onSignupClick();
            }}
          >
            Sign up
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
