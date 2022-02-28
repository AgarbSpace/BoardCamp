import connection from "../database.js";

export default async function postGamesController (request, response){

    try {

        const {name, image, stocktotal, categoryid, priceperday} = request.body;
        const insertGamesQuery = connection.query(`
        INSERT INTO games (name, image, stockTotal, categoryId, pricePerDay)
        VALUES ($1, $2, $3, $4, $5)`, [name, image, stocktotal, categoryid, priceperday]);

        response.sendStatus(201);

    } catch (error) {

        console.log(error);
        response.sendStatus(500);
    }
}