import connection from "../database.js";

export default async function getGamesController (request, response){

    try {
        
        const gamesQuery = await connection.query(`SELECT * FROM games`);
        response.send(gamesQuery.rows);

    } catch (error) {
        
        console.log(error);
        response.sendStatus(500);
    }
}