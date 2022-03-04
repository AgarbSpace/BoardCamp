import connection from "../database.js";

export async function getCustomerById (request, response){
    
    try {
        
        const {id} = request.params;

        const customerByIdQuery = await connection.query(`
            SELECT customers.*, TO_CHAR("birthday", 'YYYY-MM-DD') AS "birthday" 
            FROM customers 
            WHERE id = $1`, [id]
        );

        if(customerByIdQuery.rows.length === 0){
            return response.sendStatus(404);
        }

        const customer = customerByIdQuery.rows[0];

        response.send(customer);

    } catch (error) {
        
        response.status(500).send(error);
    }
}

export async function getCustomers (request, response){

    try {

        const {cpf} = request.query;

        if(cpf){
            
            const customerQueryByCpf = await connection.query(`
                SELECT customers.*, TO_CHAR("birthday", 'YYYY-MM-DD') AS "birthday"
                FROM customers WHERE cpf LIKE '%${cpf}%'`
            );

            return response.send(customerQueryByCpf.rows);
        }
        
        const customersQuery = await connection.query(`
            SELECT customers.*, TO_CHAR("birthday", 'YYYY-MM-DD') AS "birthday" 
            FROM customers `
        );

        const customers = customersQuery.rows;

        response.send(customers);

    } catch (error) {

        response.status(500).send(error);
    }
}

export async function postCustomer (request, response){

    try {

        const {name, birthday, cpf} = request.body;
        let {phone} = request.body;

        const findCpfQuery = await connection.query(`
        SELECT * FROM customers 
        WHERE cpf = $1`, [cpf]);

        if(findCpfQuery.rows.length !== 0){

            return response.sendStatus(409);
        }

        if(phone.length > 11){

            phone = phone.toString().replace("(", '');
            phone = phone.toString().replace(")", '');
        }

        if(phone.length < 10 || phone.length > 11){

            return response.sendStatus(400);
        }

        if(!name){

            return response.sendStatus(400);
        }

        const year = birthday.substring(0,4);
        const month = birthday.substring(5,7);
        const day = birthday.substring(8,10);

        if(parseInt(year) > 2022 || parseInt(month) > 12 || parseInt(day) > 31){

            return response.sendStatus(400);
        }

        await connection.query(`
            INSERT INTO customers (name, phone, cpf, birthday)
            VALUES ($1, $2, $3, $4)`, [name, phone, cpf, birthday]);

        response.sendStatus(201);

    } catch (error) {
        
        response.status(500).send(error);
    }
}

export async function putCustomerById (request, response){

    try {
        
        const {id} = request.params;

        const {name, birthday} = request.body;
        let {cpf, phone} = request.body;

        if(cpf.length > 11){

            cpf = cpf.toString().replace(/\.|-/gm,'');
        }

        if(cpf.length < 11){

            return response.sendStatus(400);
        }

        const findCpfQuery = await connection.query(`
        SELECT * FROM customers 
        WHERE cpf = $1`, [cpf]);

        if(findCpfQuery.rows.length > 0 && findCpfQuery.rows[0].id !== parseInt(id)){

            return response.sendStatus(409);
        }

        if(phone.length > 11){

            phone = phone.toString().replace("(", '');
            phone = phone.toString().replace(")", '');
        }

        if(phone.length < 10 || phone.length > 11){
            
            return response.sendStatus(400);
        }

        if(!name){

            return response.sendStatus(400);
        }

        const year = birthday.substring(0,4);
        const month = birthday.substring(5,7);
        const day = birthday.substring(8,10);

        if(parseInt(year) > 2022 || parseInt(month) > 12 || parseInt(day) > 31){

            return response.sendStatus(400);
        }

        await connection.query(`
            UPDATE customers 
            SET name=$1, phone=$2, cpf=$3, birthday=$4 
            WHERE id =$5`, [name, phone, cpf, birthday, id]
        );

        response.sendStatus(200);

    } catch (error) {
        
        response.status(500).send(error);
    }

}