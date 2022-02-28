import connection from "../database.js";

export default async function postCategoriesController (request, response){
    try {

        const {name} = request.body;
        const insertcategoriesQuery = connection.query(`
        INSERT INTO categories (name)
        VALUES ($1)`, [name]);
        
        response.sendStatus(201);
    } catch (error) {

        console.log(error);
        response.sendStatus(500);
    }
}