import { getPaylorPaymentStatus, startPaylorPayment } from "./paylor.server";

export type PaylorPaymentPurpose = "membership" | "processing_fee";

export async function waitForPaylorPayment(phone: string, purpose: PaylorPaymentPurpose) {
  const payment = await startPaylorPayment({
    data: {
      phone,
      purpose,
      reference: `${purpose}-${Date.now()}-${crypto.randomUUID()}`,
    },
  });

  for (let attempt = 0; attempt < 45; attempt += 1) {
    await new Promise((resolve) => window.setTimeout(resolve, 2000));
    const status = await getPaylorPaymentStatus({
      data: { transactionId: payment.transactionId },
    });
    if (status.status === "COMPLETED") return status;
    if (["FAILED", "CANCELLED", "REJECTED"].includes(status.status)) {
      throw new Error(`Payment ${status.status.toLowerCase()}.`);
    }
  }

  throw new Error("Payment confirmation timed out. Check your wallet before trying again.");
}
