import { Router } from "express";
import { deleteRental, getRentals, postRental, returnRental } from "../controllers/rentalController.js";
import { schemaValidateMiddleware } from "../middlewares/schemaValidateMiddleware.js";
import rentalSchema from "../schemas/rentalSchema.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post("/rentals", schemaValidateMiddleware(rentalSchema), postRental);
rentalsRouter.post("/rentals/:id/return", returnRental)
rentalsRouter.delete("/rentals/:id", deleteRental);

export default rentalsRouter;