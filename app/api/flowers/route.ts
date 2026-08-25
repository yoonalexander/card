import { NextResponse } from "next/server";

const ABACUS_BASE_URL = process.env.ABACUS_BASE_URL ?? "https://abacus.jasoncameron.dev";
const ABACUS_NAMESPACE = "alexyoon.com";
const ABACUS_COUNTER_KEY = "flowers";
const ABACUS_COUNTER_PATH = `${encodeURIComponent(ABACUS_NAMESPACE)}/${encodeURIComponent(ABACUS_COUNTER_KEY)}`;

type AbacusResponse = {
  value: number;
};

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const response = await requestAbacus("get");
    if (response.status === 404) {
      return flowerResponse(0);
    }

    const flowers = await readAbacusValue(response);
    return flowerResponse(flowers);
  } catch (error) {
    console.error("Unable to read the Abacus flower counter", error);
    return unavailableResponse(error);
  }
}

export async function POST() {
  try {
    const flowers = await readAbacusValue(await requestAbacus("hit"));
    return flowerResponse(flowers);
  } catch (error) {
    console.error("Unable to increment the Abacus flower counter", error);
    return unavailableResponse(error);
  }
}

function requestAbacus(action: "get" | "hit") {
  return fetch(`${ABACUS_BASE_URL}/${action}/${ABACUS_COUNTER_PATH}`, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(5000),
  });
}

async function readAbacusValue(response: Response) {
  if (!response.ok) {
    throw new AbacusRequestError(
      response.status,
      response.headers.get("Retry-After"),
      `Abacus request failed with ${response.status}`,
    );
  }

  const data = (await response.json()) as Partial<AbacusResponse>;
  if (!Number.isSafeInteger(data.value) || (data.value ?? -1) < 0) {
    throw new Error("Abacus returned an invalid flower count");
  }

  return data.value as number;
}

function flowerResponse(flowers: number) {
  return NextResponse.json(
    { flowers },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
}

function unavailableResponse(error: unknown) {
  const isRateLimited = error instanceof AbacusRequestError && error.status === 429;
  const retryAfter = isRateLimited ? error.retryAfter : null;

  return NextResponse.json(
    { error: isRateLimited ? "flower counter rate limited" : "flower counter unavailable" },
    {
      status: isRateLimited ? 429 : 503,
      headers: {
        "Cache-Control": "no-store, max-age=0",
        ...(retryAfter ? { "Retry-After": retryAfter } : {}),
      },
    },
  );
}

class AbacusRequestError extends Error {
  constructor(
    readonly status: number,
    readonly retryAfter: string | null,
    message: string,
  ) {
    super(message);
    this.name = "AbacusRequestError";
  }
}
