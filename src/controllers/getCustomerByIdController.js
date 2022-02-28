import connection from "../database.js";

export default async function getCustomerByIdController (request, response){
    
    try {
        
        const {id} = request.params;

        const customerByIdQuery = await connection.query(`
        SELECT * FROM customers WHERE id = $1`, [id]);

        if(customerByIdQuery.rows.length === 0){
            return response.sendStatus(404);
        }

        response.send(customerByIdQuery.rows);

    } catch (error) {
        
        console.log(error);
        response.sendStatus(500);
    }
}