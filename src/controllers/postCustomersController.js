import connection from "../database.js";

export default async function postCustomersController (request, response){

    try {

        const {name, phone, cpf, birthday} = request.body;

        const insertCustomerQuery = connection.query(`
            INSERT INTO customers (name, phone, cpf, birthday)
            VALUES ($1, $2, $3, $4)`, [name, phone, cpf, birthday]);

        response.sendStatus(201);

    } catch (error) {
        
        console.log(error);
        response.sendStatus(500);
    }
}