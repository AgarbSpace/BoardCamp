import connection from "../database.js";

export async function getCategory (request, response){

    try {
        
        const categoriesQuery = await connection.query(`SELECT * FROM categories`);

        response.send(categoriesQuery.rows);

    } catch (error) {

        response.status(500).send(error);
    }
}

export async function postCategory (request, response){
    try {

        const {name} = request.body;

        if(!name){

            return response.sendStatus(400);
        }

        const findCategoryQuery = await connection.query(`
        SELECT * FROM categories 
        WHERE name = $1`, [name]);

        if(findCategoryQuery.rows.length !== 0){

            return response.sendStatus(409);
        }

        await connection.query(`
        INSERT INTO categories (name)
        VALUES ($1)`, [name]);
        
        response.sendStatus(201);

    } catch (error) {

        response.status(500).send(error);
    }
}