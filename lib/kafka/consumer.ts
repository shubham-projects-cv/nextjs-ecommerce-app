import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "notification-service",
  brokers: [process.env.KAFKA_BROKER as string],
});

const consumer = kafka.consumer({ groupId: "notification-group" });

export async function startConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: "product-events" });

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;

      const event = JSON.parse(message.value.toString());
      console.log("📩 Kafka Event Received:", event);

      // Later:
      // - send email
      // - store in DB
      // - index in Elasticsearch
    },
  });
}
