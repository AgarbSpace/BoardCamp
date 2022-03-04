import connection from "../database.js";

export async function getGames (request, response){

    try {
        const {name} = request.query;

        if(name){
            
            const gamesQueryByName = await connection.query(`
                SELECT games.*, categories.id AS "categoryId", categories.name AS "categoryName" 
                FROM games
                JOIN categories ON categories.id = games."categoryId"
                WHERE UPPER(games.name) LIKE '%${name.toUpperCase()}%'
            `);
                
            return response.send(gamesQueryByName.rows);
        }

        const gamesQuery = await connection.query(`
            SELECT games.*, games.name AS "name", categories.id AS "categoryId", categories.name AS "categoryName" 
            FROM games
            JOIN categories ON categories.id = games."categoryId"`
        );
        
        const games = gamesQuery.rows;

        response.send(games);

    } catch (error) {
        
        response.status(500).send(error);
    }
}

export async function postGame (request, response){

    try {

        const {name, image, stockTotal, categoryId, pricePerDay} = request.body
        
        if(!name){
            return response.sendStatus(400);
        }

        if(parseInt(stockTotal) <= 0 || parseInt(pricePerDay) <= 0){
            return response.sendStatus(400);
        }

        const findGameQuery = await connection.query(`
            SELECT * FROM games
            WHERE name = $1`, [name]
        );

        if(findGameQuery.rows.length > 0){
            return response.sendStatus(409);
        }

        connection.query(`
            INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay")
            VALUES ($1, $2, $3, $4, $5)`, [name, image, stockTotal, categoryId, pricePerDay]
        );

        response.sendStatus(201);

    } catch (error) {

        response.status(500).send(error);
    }
}