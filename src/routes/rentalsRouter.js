import { Router } from "express";
import getRentalsController from "../controllers/getRentalsController.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getRentalsController);

export default rentalsRouter;