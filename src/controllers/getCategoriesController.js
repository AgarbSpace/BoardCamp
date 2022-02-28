import connection from "../database.js";

export default async function getCategoriesController (request, response){

    try {
        
        const categoriesQuery = await connection.query(`SELECT * FROM categories`);

        response.send(categoriesQuery.rows);

    } catch (error) {

        console.log(error);
        response.sendStatus(500);
    }
}