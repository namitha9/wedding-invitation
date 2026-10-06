export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/rsvp") {
      const cors = {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "POST, OPTIONS",
        "access-control-allow-headers": "content-type",
      };

      if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: cors });
      }

      if (request.method !== "POST") {
        return Response.json({ error: "Method not allowed" }, { status: 405, headers: cors });
      }

      try {
        const d = await request.json();
        const name = String(d.name ?? "").trim();
        const email = String(d.email ?? "").trim();
        const attendance = String(d.attendance ?? "").trim();
        const meal = String(d.meal ?? "").trim();
        const message = String(d.message ?? "").trim();
        const guests = Number(d.guests ?? 1);

        if (!name || !attendance) {
          return Response.json({ error: "Name and attendance are required." }, { status: 400, headers: cors });
        }
        if (!Number.isInteger(guests) || guests < 1 || guests > 10) {
          return Response.json({ error: "Guest count must be between 1 and 10." }, { status: 400, headers: cors });
        }

        await env.DB.prepare(
          `INSERT INTO rsvps (name,email,attendance,guests,meal,message,created_at)
           VALUES (?,?,?,?,?,?,?)`
        ).bind(
          name, email, attendance, guests, meal, message, new Date().toISOString()
        ).run();

        return Response.json({ ok: true }, { headers: cors });
      } catch (error) {
        return Response.json({ error: "Unable to save RSVP." }, { status: 500, headers: cors });
      }
    }

    return env.ASSETS.fetch(request);
  },
};
