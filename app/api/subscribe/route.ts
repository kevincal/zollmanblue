const KLAVIYO_API = "https://a.klaviyo.com/api";
const KLAVIYO_REVISION = "2025-07-15";
const AUDIENCES = ["trade", "collector"] as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Audience = (typeof AUDIENCES)[number];

function klaviyo(path: string, body: unknown) {
  return fetch(`${KLAVIYO_API}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Klaviyo-API-Key ${process.env.KLAVIYO_API_KEY}`,
      accept: "application/vnd.api+json",
      "content-type": "application/vnd.api+json",
      revision: KLAVIYO_REVISION,
    },
    body: JSON.stringify(body),
  });
}

export async function POST(request: Request) {
  const apiKey = process.env.KLAVIYO_API_KEY;
  const listId = process.env.KLAVIYO_LIST_ID;
  if (!apiKey || !listId) {
    console.error("subscribe: KLAVIYO_API_KEY or KLAVIYO_LIST_ID is not set");
    return Response.json({ error: "Signup is unavailable right now." }, { status: 500 });
  }

  const { email, audience } = (await request.json().catch(() => ({}))) as {
    email?: unknown;
    audience?: unknown;
  };
  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (!AUDIENCES.includes(audience as Audience)) {
    return Response.json({ error: "Please choose designer or collector." }, { status: 400 });
  }
  const address = email.trim().toLowerCase();

  // Subscription jobs can't carry custom properties, so the audience is set on the profile first.
  const profile = await klaviyo("/profile-import", {
    data: {
      type: "profile",
      attributes: { email: address, properties: { audience } },
    },
  });
  if (!profile.ok) {
    console.error("subscribe: profile-import failed", profile.status, await profile.text());
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 502 });
  }

  const subscribe = await klaviyo("/profile-subscription-bulk-create-jobs", {
    data: {
      type: "profile-subscription-bulk-create-job",
      attributes: {
        custom_source: "Website popup",
        profiles: {
          data: [
            {
              type: "profile",
              attributes: {
                email: address,
                subscriptions: { email: { marketing: { consent: "SUBSCRIBED" } } },
              },
            },
          ],
        },
      },
      relationships: { list: { data: { type: "list", id: listId } } },
    },
  });
  if (!subscribe.ok) {
    console.error("subscribe: subscription job failed", subscribe.status, await subscribe.text());
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 502 });
  }

  return Response.json({ ok: true });
}
