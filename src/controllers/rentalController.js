import dayjs from "dayjs";
import connection from "../database.js";


export async function postRental (request, response){

    try {
        
        const {customerId, gameId, daysRented} = request.body;

        const customerQuery = await connection.query(`
            SELECT * FROM customers
            WHERE id = $1`, [customerId]
        );

        const gameQuery = await connection.query(`
            SELECT * FROM games
            WHERE id = $1`, [gameId]
        );

        if(gameQuery.rows.length > 0 && customerQuery.rows.length > 0 && daysRented > 0){
            
            const gameStock = gameQuery.rows[0].stockTotal;

            if(gameStock === 0){
                return response.sendStatus(400)
            }

            const rentDate = `${dayjs().get('year')}-${dayjs().get('month')}-${dayjs().get('date')}`;
            const originalPrice = gameQuery.rows[0].pricePerDay * daysRented;
        
            await connection.query(`
                INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
                VALUES ($1, $2, $3, $4, $5, $6, $7)`, [customerId, gameId, rentDate, daysRented, null, originalPrice, null]
            );

            await connection.query(`
                UPDATE games
                SET "stockTotal" = $1
                WHERE id = $2`, [(gameStock-1), gameId]
            );
            
            return response.sendStatus(201);
        }

        response.sendStatus(400);

    } catch (error) {
        
        response.status(500).send(error)
    }
}

export async function getRentals (request, response){

    try {
        
        const {customerId} = request.query;

        if(customerId){

            const rentalsByCustomerIdQuery = await connection.query(`
                SELECT rentals.*, customers.id AS "customerId", customers.name AS "customerName",
                    games.id AS "gameId", games.name AS "gameName", categories.id AS "categoryId", 
                    categories.name AS "categoryName", TO_CHAR("rentDate", 'YYYY-MM-DD') AS "rentDate",
                    TO_CHAR("returnDate", 'YYYY-MM-DD') AS "returnDate"
                FROM rentals
                JOIN customers ON customers.id = rentals."customerId"
                JOIN games ON games.id = rentals."gameId"
                JOIN categories ON categories.id = games."categoryId"
                WHERE customers.id = $1`, [customerId]
            )

        const rentals = rentalsByCustomerIdQuery.rows

        const rental = rentals.map(allRentals => ({
            id: allRentals.id,
            customerId: allRentals.customerId, 
            gameId: allRentals.gameId,
            rentDate: allRentals.rentDate,
            daysRented: allRentals.daysRented,
            returnDate: allRentals.returnDate,
            originalPrice: allRentals.originalPrice,
            delayFee: allRentals.delayFee, 
            customer: {name: allRentals.customerName, id: allRentals.customerId },
            game: {id: allRentals.gameId, name: allRentals.gameName, categoryId: allRentals.categoryId, categoryName: allRentals.categoryName}
        }));


            return response.send(rental);
        }

        const rentalsQuery = await connection.query(`
            SELECT rentals.*, customers.id AS "customerId", customers.name AS "customerName",
                games.id AS "gameId", games.name AS "gameName", categories.id AS "categoryId", 
                categories.name AS "categoryName", TO_CHAR("rentDate", 'YYYY-MM-DD') AS "rentDate",
                TO_CHAR("returnDate", 'YYYY-MM-DD') AS "returnDate"
            FROM rentals
            JOIN customers ON customers.id = rentals."customerId"
            JOIN games ON games.id = rentals."gameId"
            JOIN categories ON categories.id = games."categoryId"
        `)

        const rentals = rentalsQuery.rows

        const rental = rentals.map(allRentals => ({
            id: allRentals.id,
            customerId: allRentals.customerId, 
            gameId: allRentals.gameId,
            rentDate: allRentals.rentDate,
            daysRented: allRentals.daysRented,
            returnDate: allRentals.returnDate,
            originalPrice: allRentals.originalPrice,
            delayFee: allRentals.delayFee, 
            customer: {name: allRentals.customerName, id: allRentals.customerId },
            game: {id: allRentals.gameId, name: allRentals.gameName, categoryId: allRentals.categoryId, categoryName: allRentals.categoryName}
        }));


        response.send(rental);

    } catch (error) {

        response.status(500).send(error);
    }
}

export async function returnRental (request, response){

    try {
        
        const {id} = request.params;
        
        const findRentalByIdQuery = await connection.query(`
        SELECT rentals.*, TO_CHAR("rentDate", 'YYYY/MM/DD') AS "rentDate"
        FROM rentals
        WHERE id = $1`, [id]
        );
        
        
        if(findRentalByIdQuery.rows.length > 0){
            
            if(findRentalByIdQuery.rows[0].returnDate !== null){
                return response.sendStatus(400)
            }
            
            const gameId = findRentalByIdQuery.rows[0].gameId;
            const returnDate = `${dayjs().get('year')}-${dayjs().get('month')+1}-${dayjs().get('date')}`;
            const dayRented = findRentalByIdQuery.rows[0].rentDate;
            const dayInMilliseconds = 24 * 60 * 60 * 1000;
            const rentDay = dayRented.split("/");
            const returnDay = returnDate.split("-");
            const rentDate = new Date(rentDay[0], rentDay[1], rentDay[2]);
            const dayOfReturn = new Date(returnDay[0], returnDay[1], returnDay[2]);
            const rentDateInMiliseconds = rentDate.getTime();
            const returnDateInMiliseconds = dayOfReturn.getTime();
            const daysInMilisecondsDifference = returnDateInMiliseconds - rentDateInMiliseconds;
            const numberOfDays = daysInMilisecondsDifference/dayInMilliseconds;
            const daysRented = findRentalByIdQuery.rows[0].daysRented;
            
            if(numberOfDays > daysRented){

                const delay = numberOfDays - daysRented;
                
                const findGameQuery = await connection.query(`
                SELECT * FROM games
                WHERE id = $1`, [gameId]
                );
                
                const gamePricePerDay = findGameQuery.rows[0].pricePerDay;
                const delayFee = delay*gamePricePerDay;

                await connection.query(`
                    UPDATE rentals
                    SET "delayFee" = $1
                    WHERE id = $2`, [delayFee, id]
                );
            }

            const gameQuery = await connection.query(`
                SELECT * FROM games
                WHERE id = $1`, [gameId]
                );

            const stockTotal = gameQuery.rows[0].stockTotal;

            await connection.query(`
                UPDATE games
                SET "stockTotal" = $1
                WHERE id = $2`, [(parseInt(stockTotal) + 1), gameId]
            );

            await connection.query(`
                UPDATE rentals
                SET "returnDate" = $1
                WHERE id = $2`, [returnDate, id]
            );

            return response.sendStatus(200);
        }

        response.sendStatus(404);

    } catch (error) {
        response.status(500).send(error);
    }
}

export async function deleteRental (request, response){

    try {
        
        const {id} = request.params;

        const findRentalByIdQuery = await connection.query(`
            SELECT * FROM rentals
            WHERE id = $1`, [id]
        )

        if(findRentalByIdQuery.rows.length > 0){

            if(findRentalByIdQuery.rows[0].returnDate !== null){
                return response.sendStatus(400)
            }

            await connection.query(`
                DELETE FROM rentals
                WHERE id = $1`, [id]
            );

            return response.sendStatus(200);
        }

        response.sendStatus(404)

    } catch (error) {

        response.status(500).send(error);
    }
}