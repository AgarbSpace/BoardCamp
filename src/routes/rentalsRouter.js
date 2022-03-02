import { Router } from "express";
import { getRentals } from "../controllers/rentalController.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getRentals);

export default rentalsRouter;