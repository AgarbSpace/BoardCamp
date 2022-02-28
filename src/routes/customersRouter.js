import { Router } from "express";
import getCustomerByIdController from "../controllers/getCustomerByIdController.js";
import getCustomersController from "../controllers/getCustomersController.js";
import postCustomersController from "../controllers/postCustomersController.js";

const customersRouter = Router();

customersRouter.get("/customers", getCustomersController);
customersRouter.get("/customers/:id", getCustomerByIdController);
customersRouter.post("/customers", postCustomersController);

export default customersRouter;