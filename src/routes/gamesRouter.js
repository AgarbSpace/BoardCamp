import { Router } from "express";
import getGamesController from "../controllers/getGamesController.js";
import postGamesController from "../controllers/postGamesController.js";

const gamesRouter = Router();

gamesRouter.get("/games", getGamesController)
gamesRouter.post("/games", postGamesController)

export default gamesRouter;