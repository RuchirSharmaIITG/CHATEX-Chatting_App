import amqp from "amqplib";
import { io } from "./socket/socket.js";
import dotenv from "dotenv";
dotenv.config();

export const startProfileUpdateConsumer = async () => {
  try {
    const connection = await amqp.connect({
      protocol: "amqp",
      hostname: process.env.Rabbitmq_Host!,
      port: 5672,
      username: process.env.Rabbitmq_Username!,
      password: process.env.Rabbitmq_Password!,
    });

    const channel = await connection.createChannel();
    const queueName = "profile-updates";

    await channel.assertQueue(queueName, { durable: true });

    console.log(
      "✅ Chat Service consumer started, listening for profile updates",
    );

    channel.consume(queueName, (msg) => {
      if (msg) {
        try {
          const { userId, newImage } = JSON.parse(msg.content.toString());

          io.emit("userProfileUpdated", { userId, newImage });

          channel.ack(msg);
        } catch (error) {
          console.error("Failed to process profile update message", error);
        }
      }
    });
  } catch (error) {
    console.error("Failed to start RabbitMQ consumer in Chat Service", error);
  }
};
