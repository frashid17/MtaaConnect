import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  signInWithEmail,
  signInWithGoogle,
  createUserWithEmail,
  signOut,
  updateUserProfile,
} from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

export function useAuthActions() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { currentUser } = useAuth();

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await signInWithEmail(email, password);
      toast({
        title: "Login successful",
        description: "You have been logged in",
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      // The redirect will happen automatically
      return true;
    } catch (error: any) {
      toast({
        title: "Google login failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, displayName: string) => {
    setIsLoading(true);
    try {
      const result = await createUserWithEmail(email, password);
      await updateUserProfile(result.user, displayName);
      toast({
        title: "Registration successful",
        description: "Your account has been created",
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut();
      toast({
        title: "Logged out",
        description: "You have been logged out",
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    loginWithGoogle,
    register,
    logout,
    isLoading,
    isAuthenticated: !!currentUser,
    currentUser,
  };
}
