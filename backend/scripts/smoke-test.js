/* eslint-disable no-console */
const DEFAULT_BASE_URL = process.env.SMOKE_BASE_URL || "http://localhost:5000";
const TIMEOUT_MS = Number(process.env.SMOKE_TIMEOUT_MS || 8000);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const request = async (path, options = {}) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${DEFAULT_BASE_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    let body = null;
    try {
      body = await response.json();
    } catch (_error) {
      body = null;
    }

    return { response, body };
  } finally {
    clearTimeout(timer);
  }
};

const assertOk = (condition, message) => {
  if (!condition) {
    throw new Error(message);
  }
};

const main = async () => {
  console.log(`[smoke] Base URL: ${DEFAULT_BASE_URL}`);

  const { response: healthRes, body: healthBody } = await request("/health");
  assertOk(healthRes.ok, `/health failed with status ${healthRes.status}`);
  assertOk(healthBody?.success === true, "/health success must be true");
  console.log("[smoke] PASS /health");

  const { response: openapiRes, body: openapiBody } = await request("/api/openapi.json");
  assertOk(openapiRes.ok, `/api/openapi.json failed with status ${openapiRes.status}`);
  assertOk(openapiBody?.openapi?.startsWith("3."), "openapi version is missing/invalid");
  console.log("[smoke] PASS /api/openapi.json");

  const username = process.env.SMOKE_USERNAME;
  const password = process.env.SMOKE_PASSWORD;
  if (!username || !password) {
    console.log("[smoke] SKIP auth checks (set SMOKE_USERNAME and SMOKE_PASSWORD to enable)");
    return;
  }

  const { response: loginRes, body: loginBody } = await request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  assertOk(loginRes.ok, `/api/auth/login failed with status ${loginRes.status}`);
  const token = loginBody?.data?.token;
  assertOk(Boolean(token), "login token missing");
  console.log("[smoke] PASS /api/auth/login");

  const authHeaders = { Authorization: `Bearer ${token}` };

  const { response: topicsRes, body: topicsBody } = await request("/api/topics", {
    headers: authHeaders,
  });
  assertOk(topicsRes.ok, `/api/topics failed with status ${topicsRes.status}`);
  assertOk(Array.isArray(topicsBody?.data), "/api/topics data must be array");
  console.log("[smoke] PASS /api/topics");

  const { response: reviewTodayRes, body: reviewTodayBody } = await request("/api/review/today?limit=1", {
    headers: authHeaders,
  });
  assertOk(reviewTodayRes.ok, `/api/review/today failed with status ${reviewTodayRes.status}`);
  assertOk(Array.isArray(reviewTodayBody?.data), "/api/review/today data must be array");
  console.log("[smoke] PASS /api/review/today?limit=1");

  const { response: planRes, body: planBody } = await request("/api/ai/generate-today-plan", {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({}),
  });
  assertOk(planRes.ok, `/api/ai/generate-today-plan failed with status ${planRes.status}`);
  assertOk(planBody?.data?.today_plan?.meta?.llm === false, "today_plan.meta.llm must be false");
  console.log("[smoke] PASS /api/ai/generate-today-plan");

  // Tiny delay helps logs stay readable in CI.
  await sleep(100);
};

main()
  .then(() => {
    console.log("[smoke] DONE");
  })
  .catch((error) => {
    console.error(`[smoke] FAIL: ${error.message}`);
    process.exit(1);
  });
