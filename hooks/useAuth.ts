"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/client";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;
    let authEventReceived = false;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      authEventReceived = true;

      if (mounted) {
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    });

    async function initializeAuth() {
      try {
        const { data, error } = await supabase.auth.getUser();

        if (!mounted || authEventReceived) return;

        setUser(error ? null : data.user);
      } catch {
        if (!mounted || authEventReceived) return;

        setUser(null);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    void initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function signOut() {
    const supabase = createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }
  }

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    signOut,
  };
}
