import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

import readline from "readline";
import { createClient } from "@supabase/supabase-js";

console.log("ENV DEBUG:", {
  SUPABASE_URL: process.env.SUPABASE_URL,
  SERVICE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? "LOADED" : "MISSING",
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(q) {
  return new Promise((res) => rl.question(q, res));
}

async function main() {
  console.log("\n=== CAMPUS360 SUPER ADMIN PANEL (CLI) ===");
  console.log("1. Add Principal");
  console.log("2. Disable Principal");
  console.log("3. Delete Principal");
  console.log("4. Exit\n");

  const choice = await ask("Select option (1–4): ");

  if (choice === "1") {
    const email = await ask("Principal Email: ");

    const { data, error } =
    await supabase.auth.admin.inviteUserByEmail(email, {
      redirectTo: "http://localhost:5173/setup-password",
    });


    if (error) {
      console.log("Error:", error.message);
      rl.close();
      return;
    }

    await supabase.from("profiles").insert({
      id: data.user.id,
      role: "principal",
      status: "pending",
      created_by: null,
    });

    console.log("✔ Principal invited via magic link");
  }

  else if (choice === "2") {
    const email = await ask("Principal Email to Disable: ");

    const { data } = await supabase.auth.admin.listUsers();
    const user = data.users.find((u) => u.email === email);

    if (!user) {
      console.log("User not found");
      rl.close();
      return;
    }

    await supabase
      .from("profiles")
      .update({ status: "disabled" })
      .eq("id", user.id);

    console.log("✔ Principal disabled");
  }

  else if (choice === "3") {
    const email = await ask("Principal Email to Delete: ");

    const { data } = await supabase.auth.admin.listUsers();
    const user = data.users.find((u) => u.email === email);

    if (!user) {
      console.log("User not found");
      rl.close();
      return;
    }

    await supabase.auth.admin.deleteUser(user.id);
    console.log("✔ Principal permanently deleted");
  }

  rl.close();
}

main();
