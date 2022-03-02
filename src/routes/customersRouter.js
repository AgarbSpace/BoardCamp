import { Router } from "express";
import { getCustomerById, getCustomers, postCustomer, putCustomerById } from "../controllers/customersController.js";
import { schemaValidateMiddleware } from "../middlewares/schemaValidateMiddleware.js";
import customerSchema from "../schemas/customerSchema.js";

const customersRouter = Router();

customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", getCustomerById);
customersRouter.post("/customers", schemaValidateMiddleware(customerSchema) ,postCustomer);
customersRouter.put("/customers/:id", putCustomerById);

export default customersRouter;