import cluster from "cluster";
import { configDotenv } from "dotenv";
import express, { Express, Request, Response } from "express";
import { availableParallelism } from "os";

configDotenv();

if (cluster.isPrimary) {
  for (let i = 0; i < availableParallelism(); i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  const app: Express = express();

  app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ message: `hello from server! ${process.pid}.` });
  });

  const PORT = process.env.PORT;
  app.listen(PORT, () => {
    console.log("server is up and running! at port:3000");
  });
}
