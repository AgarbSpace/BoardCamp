import connection from "../database.js";

export async function getGames (request, response){

    try {
        const  {name} = request.query;

        if(name){
            const gamesQueryByName = await connection.query(`
            SELECT * FROM games WHERE UPPER(name) LIKE '%${name.toUpperCase()}%'`);

            return response.send(gamesQueryByName.rows);
        }

        const gamesQuery = await connection.query(`SELECT * FROM games`);
        response.send(gamesQuery.rows);

    } catch (error) {
        
        response.status(500).send(error);
    }
}

export async function postGame (request, response){

    try {

        const {name, image, stocktotal, categoryid, priceperday} = request.body;
        const insertGamesQuery = connection.query(`
        INSERT INTO games (name, image, stockTotal, categoryId, pricePerDay)
        VALUES ($1, $2, $3, $4, $5)`, [name, image, stocktotal, categoryid, priceperday]);

        response.sendStatus(201);

    } catch (error) {

        response.status(500).send(error);
    }
}