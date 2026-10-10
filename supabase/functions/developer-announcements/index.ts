import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "apikey, authorization, content-type, x-client-info, x-developer-password",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
};

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function digest(value: string) {
  const bytes = new TextEncoder().encode(value);
  return new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));
}

async function passwordsMatch(provided: string, expected: string) {
  const [providedHash, expectedHash] = await Promise.all([
    digest(provided),
    digest(expected),
  ]);
  let difference = 0;
  for (let index = 0; index < expectedHash.length; index += 1) {
    difference |= providedHash[index] ^ expectedHash[index];
  }
  return difference === 0;
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (!["GET", "POST", "DELETE"].includes(request.method)) {
    return jsonResponse({ error: "Method not allowed." }, 405);
  }

  const expectedPassword = Deno.env.get("DEVELOPER_PASSWORD") || "";
  const providedPassword = request.headers.get("x-developer-password") || "";
  if (
    expectedPassword.length < 16 ||
    expectedPassword.length > 128 ||
    !providedPassword ||
    providedPassword.length > 128 ||
    !(await passwordsMatch(providedPassword, expectedPassword))
  ) {
    return jsonResponse({ error: "Developer authentication failed." }, 401);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Supabase server credentials are missing.");
    return jsonResponse({ error: "Announcement service is not configured." }, 503);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    if (request.method === "GET") {
      const { data, error } = await supabase
        .from("announcements")
        .select("id, title, body, published_at")
        .order("published_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return jsonResponse({ announcements: data || [] });
    }

    let payload: Record<string, unknown>;
    try {
      payload = await request.json();
    } catch {
      return jsonResponse({ error: "Invalid JSON request." }, 400);
    }

    if (request.method === "POST") {
      const title = typeof payload.title === "string" ? payload.title.trim() : "";
      const body = typeof payload.body === "string" ? payload.body.trim() : "";
      if (!title || title.length > 100 || !body || body.length > 2000) {
        return jsonResponse({ error: "Title or message has an invalid length." }, 400);
      }

      const { data, error } = await supabase
        .from("announcements")
        .insert({ title, body })
        .select("id, title, body, published_at")
        .single();
      if (error) throw error;
      return jsonResponse({ announcement: data }, 201);
    }

    const id = typeof payload.id === "string" ? payload.id : "";
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      return jsonResponse({ error: "Invalid announcement ID." }, 400);
    }

    const { data, error } = await supabase
      .from("announcements")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle();
    if (error) throw error;
    if (!data) return jsonResponse({ error: "Announcement not found." }, 404);
    return jsonResponse({ deleted: true });
  } catch (error) {
    console.error("Announcement operation failed:", error);
    return jsonResponse({ error: "Announcement operation failed." }, 500);
  }
});
