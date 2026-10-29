const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "apikey, authorization, content-type, x-client-info, x-developer-password, x-developer-resource",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
};

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function requestAnnouncements(
  url: string,
  serviceRoleKey: string,
  path: string,
  init: RequestInit = {},
) {
  const response = await fetch(`${url}/rest/v1/announcements${path}`, {
    ...init,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
  const responseBody = await response.text();
  let data: unknown = null;
  if (responseBody) {
    try {
      data = JSON.parse(responseBody);
    } catch {
      throw new Error("Announcement service returned an invalid response.");
    }
  }
  if (!response.ok) {
    throw new Error(`Announcement service returned HTTP ${response.status}.`);
  }
  return data;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function omitCredentialFields(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(omitCredentialFields);
  if (!isRecord(value)) return value;
  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => !/(password|token|secret|credential)/i.test(key))
      .map(([key, field]) => [key, omitCredentialFields(field)]),
  );
}

async function requestAuthUsers(url: string, serviceRoleKey: string) {
  const users: Record<string, unknown>[] = [];
  const pageSize = 1000;
  const visibleFields = [
    "id",
    "aud",
    "role",
    "email",
    "phone",
    "created_at",
    "updated_at",
    "last_sign_in_at",
    "email_confirmed_at",
    "phone_confirmed_at",
    "confirmed_at",
    "confirmation_sent_at",
    "banned_until",
    "is_anonymous",
    "app_metadata",
    "user_metadata",
    "identities",
  ];

  for (let page = 1; page <= 1000; page += 1) {
    const query = new URLSearchParams({
      page: String(page),
      per_page: String(pageSize),
    });
    const response = await fetch(
      `${url}/auth/v1/admin/users?${query}`,
      {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error(`Auth user listing returned HTTP ${response.status}.`);
    }

    const payload: unknown = await response.json();
    const pageUsers = isRecord(payload) && Array.isArray(payload.users)
      ? payload.users
      : null;
    if (!pageUsers) throw new Error("Auth user listing returned an invalid response.");

    for (const user of pageUsers) {
      if (!isRecord(user)) continue;
      const visibleUser: Record<string, unknown> = {};
      for (const field of visibleFields) {
        if (Object.prototype.hasOwnProperty.call(user, field)) {
          visibleUser[field] = omitCredentialFields(user[field]);
        }
      }
      users.push(visibleUser);
    }

    if (pageUsers.length < pageSize) return users;
  }

  throw new Error("Auth user listing exceeded the supported page limit.");
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

  try {
    if (request.method === "GET") {
      if (request.headers.get("x-developer-resource") === "users") {
        const users = await requestAuthUsers(supabaseUrl, serviceRoleKey);
        return jsonResponse({ users });
      }

      const query = new URLSearchParams({
        select: "id,title,body,published_at",
        order: "published_at.desc",
        limit: "100",
      });
      const data = await requestAnnouncements(
        supabaseUrl,
        serviceRoleKey,
        `?${query}`,
      );
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

      const data = await requestAnnouncements(
        supabaseUrl,
        serviceRoleKey,
        "?select=id,title,body,published_at",
        {
          method: "POST",
          headers: { Prefer: "return=representation" },
          body: JSON.stringify({ title, body }),
        },
      );
      const announcement = Array.isArray(data) ? data[0] : null;
      if (!announcement) throw new Error("Announcement insert returned no row.");
      return jsonResponse({ announcement }, 201);
    }

    const id = typeof payload.id === "string" ? payload.id : "";
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      return jsonResponse({ error: "Invalid announcement ID." }, 400);
    }

    const query = new URLSearchParams({ id: `eq.${id}`, select: "id" });
    const data = await requestAnnouncements(
      supabaseUrl,
      serviceRoleKey,
      `?${query}`,
      { method: "DELETE", headers: { Prefer: "return=representation" } },
    );
    if (!Array.isArray(data) || data.length === 0) {
      return jsonResponse({ error: "Announcement not found." }, 404);
    }
    return jsonResponse({ deleted: true });
  } catch (error) {
    console.error("Announcement operation failed:", error);
    return jsonResponse({ error: "Announcement operation failed." }, 500);
  }
});
