import Fastify from "fastify";

const app = Fastify({
  logger: true,
});

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "0.0.0.0";

async function start(): Promise<void> {
  try {
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
