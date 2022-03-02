import connection from "../database.js";

export async function getRentals (request, response){
    try {
        
        const rentalsQuery = await connection.query(`SELECT * FROM rentals`)

        response.send(rentalsQuery.rows);

    } catch (error) {

        response.status(500).send(error);
    }
}