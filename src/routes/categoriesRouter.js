import { Router } from "express";
import getCategoriesController from "../controllers/getCategoriesController.js";
import postCategoriesController from "../controllers/postCategoriesController.js";

const categoriesRouter = Router();

categoriesRouter.get("/categories", getCategoriesController);
categoriesRouter.post("/categories", postCategoriesController);

export default categoriesRouter;