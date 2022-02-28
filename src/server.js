import express from "express";
import cors from "cors";
import router from "./routes/routes.js";

const server = express();
server.use(express.json());
server.use(cors());
server.use(router)

server.listen(4000, () => console.log("Server is running on 4000"));