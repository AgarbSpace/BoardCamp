import { Router } from "express";
import { getGames, postGame } from "../controllers/gameController.js";
import { schemaValidateMiddleware } from "../middlewares/schemaValidateMiddleware.js";
import gameSchema from "../schemas/gameSchema.js";

const gamesRouter = Router();

gamesRouter.get("/games", getGames);
gamesRouter.post("/games",schemaValidateMiddleware(gameSchema) ,postGame);

export default gamesRouter;