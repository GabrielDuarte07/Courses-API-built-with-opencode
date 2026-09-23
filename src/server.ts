import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "@fastify/type-provider-zod";
import Fastify from "fastify";

import { courseRoutes } from "./course/course.routes.js";
import { userRoutes } from "./user/user.routes.js";

const app = Fastify({
  logger: true,
}).withTypeProvider<ZodTypeProvider>();

// Add the Zod schema validator and serializer compilers.
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "0.0.0.0";

// Comma-separated list of allowed origins. Defaults to reflecting the request origin.
const CORS_ORIGIN = process.env.CORS_ORIGIN?.split(",") ?? true;

async function start(): Promise<void> {
  try {
    await app.register(cors, {
      origin: CORS_ORIGIN,
    });

    await app.register(helmet, {
      contentSecurityPolicy: false,
    });

    await app.register(userRoutes);
    await app.register(courseRoutes);

    await app.listen({ port: PORT, host: HOST });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

async function shutdown(signal: string): Promise<void> {
  app.log.info(`${signal} received, shutting down gracefully...`);
  await app.close();
  process.exit(0);
}

function handleSigint(): void {
  void shutdown("SIGINT");
}

function handleSigterm(): void {
  void shutdown("SIGTERM");
}

process.on("SIGINT", handleSigint);
process.on("SIGTERM", handleSigterm);

void start();

export default app;
