import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "product-service",
  brokers: [process.env.KAFKA_BROKER as string],
});

const producer = kafka.producer();

let isConnected = false;

export async function publishEvent(
  topic: string,
  message: Record<string, unknown>
) {
  if (process.env.ENABLE_KAFKA !== "true") {
    return; // Kafka disabled → do nothing
  }

  try {
    if (!isConnected) {
      await producer.connect();
      isConnected = true;
    }

    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  } catch (error) {
    console.warn("Kafka publish failed, skipping:", error);
    // IMPORTANT: do NOT throw
  }
}
