import { Router } from "express";
import { getCategory, postCategory } from "../controllers/categoryController.js";
import { schemaValidateMiddleware } from "../middlewares/schemaValidateMiddleware.js";
import categorySchema from "../schemas/categorySchema.js";


const categoriesRouter = Router();

categoriesRouter.get("/categories", getCategory);
categoriesRouter.post("/categories", schemaValidateMiddleware(categorySchema) ,postCategory);

export default categoriesRouter;