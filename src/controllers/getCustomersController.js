import connection from "../database.js";

export default async function getCustomersController(request, response){

    try {

        const {cpf} = request.query;

        if(cpf){
            
            const customerQueryByCpf = await connection.query(`
            SELECT * FROM customers WHERE cpf LIKE '%${cpf}%'`);

            return response.send(customerQueryByCpf.rows);
        }
        
        const customersQuery = await connection.query(`SELECT * FROM customers`);
        response.send(customersQuery.rows);

    } catch (error) {

        console.log(error);
        response.sendStatus(500);
    }
}