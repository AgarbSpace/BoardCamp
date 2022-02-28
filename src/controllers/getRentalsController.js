import connection from "../database.js";

export default async function getRentalsController (request, response){
    try {
        
        const rentalsQuery = await connection.query(`SELECT * FROM rentals`)

        response.send(rentalsQuery.rows);

    } catch (error) {

        console.log(error);
        response.sendStatus(500);
    }
}