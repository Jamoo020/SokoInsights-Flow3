import { createServerFn } from "@tanstack/react-start";

import { MEMBERSHIP_ACTIVATION_PRICE, PROCESSING_FEE } from "./data";

const PAYLOR_API_BASE_URL = "https://api.paylorke.com/api/v1";

type PaymentPurpose = "membership" | "processing_fee";

type PaymentResponse = {
  transactionId: string;
  status: string;
};

type TransactionResponse = {
  id: string;
  status: string;
  reference?: string;
};

function getPaylorApiKey() {
  const runtime = globalThis as typeof globalThis & {
    process?: { env?: Record<string, string | undefined> };
  };
  const apiKey = runtime.process?.env?.PAYLOR_API_KEY;
  if (!apiKey) throw new Error("PAYLOR_API_KEY is not configured on the server.");
  return apiKey;
}

function getPaylorChannelId() {
  const runtime = globalThis as typeof globalThis & {
    process?: { env?: Record<string, string | undefined> };
  };
  const channelId = runtime.process?.env?.PAYLOR_CHANNEL_ID;
  if (!channelId) throw new Error("PAYLOR_CHANNEL_ID is not configured on the server.");
  return channelId;
}

function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) return `254${digits.slice(1)}`;
  if (digits.startsWith("254")) return digits;
  return digits;
}

function paymentAmount(purpose: PaymentPurpose) {
  return purpose === "membership" ? MEMBERSHIP_ACTIVATION_PRICE : PROCESSING_FEE;
}

async function paylorRequest<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${PAYLOR_API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${getPaylorApiKey()}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });

  const payload = (await response.json().catch(() => null)) as {
    message?: string;
    error?: { message?: string };
  } | null;
  if (!response.ok) {
    throw new Error(payload?.error?.message ?? payload?.message ?? "Paylor payment failed.");
  }
  return payload as T;
}

export const startPaylorPayment = createServerFn({ method: "POST" })
  .validator((data: { phone: string; purpose: PaymentPurpose; reference: string }) => data)
  .handler(async ({ data }): Promise<PaymentResponse> => {
    const phone = normalizePhone(data.phone);
    if (!/^2547\d{8}$/.test(phone)) throw new Error("Enter a valid Kenyan M-PESA phone number.");

    return paylorRequest<PaymentResponse>("/merchants/payments/stk-push", {
      method: "POST",
      headers: { "Idempotency-Key": data.reference },
      body: JSON.stringify({
        phone,
        amount: paymentAmount(data.purpose),
        reference: data.reference,
        channelId: getPaylorChannelId(),
        description:
          data.purpose === "membership"
            ? "SokoInsights membership activation"
            : "SokoInsights withdrawal processing fee",
      }),
    });
  });

export const getPaylorPaymentStatus = createServerFn({ method: "POST" })
  .validator((data: { transactionId: string }) => data)
  .handler(async ({ data }): Promise<TransactionResponse> => {
    if (!/^[a-zA-Z0-9_-]+$/.test(data.transactionId)) {
      throw new Error("Invalid Paylor transaction ID.");
    }
    return paylorRequest<TransactionResponse>(
      `/merchants/payments/transactions/${encodeURIComponent(data.transactionId)}`,
      { method: "GET" },
    );
  });
