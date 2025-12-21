import { supabase } from "@/lib/supabase";

export async function loginUser(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  const user = data.user;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError) throw new Error("Profile not found");

  return {
    user,
    role: profile.role,
  };
}

export async function logoutUser() {
  await supabase.auth.signOut();
}
 // Line 33
export async function getCurrentSession() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return null;

  const user = session.user;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error) return null;

  return {
    user,
    role: profile.role,
  };
}
