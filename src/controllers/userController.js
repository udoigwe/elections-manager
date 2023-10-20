const db = require('../utils/dbConfig');
const util = require('util');
const CryptoJS = require('crypto-js');

module.exports = {
    create: async (req, res) => {
        const {
            user_firstname,
            user_lastname,
            user_email,
            user_role,
            password
        } = req.body;

        const now = Math.floor(Date.now() / 1000); 

        const connection = await util.promisify(db.getConnection).bind(db)();

        try
        {
            const encPassword = CryptoJS.AES.encrypt(password, process.env.CRYPTOJS_SECRET).toString();

            //check if email already exists
            const users = await util.promisify(connection.query).bind(connection)("SELECT * FROM users WHERE user_email = ? LIMIT 1", [ user_email]);

            if(users.length > 0)
            {
                throw new Error("The provided email address already exist")
            }

            //insert user into database
            await util.promisify(connection.query).bind(connection)(`
                INSERT INTO users (user_firstname, user_lastname, user_email, enc_password, plain_password, user_role, user_created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [ user_firstname, user_lastname, user_email, encPassword, password, user_role, now ]);

            res.json({
                error: false,
                message:'User created successfully'
            })
        }
        catch(e)
        {   
            res.json({
                error:true,
                message:e.message
            })
        }
        finally
        {
            connection.release();
        }
    },
    readAll: async (req, res) => {
        const {
            user_status,
            user_role
        } = req.query;

        const page = req.query.page ? parseInt(req.query.page) : null;
        const perPage = req.query.perPage ? parseInt(req.query.perPage) : null;

        let query = "SELECT * FROM users WHERE 1 = 1";
        const queryParams = [];

        let query2 = "SELECT COUNT(*) AS total_records FROM users WHERE 1 = 1";
        const queryParams2 = [];

        if(user_status)
        {
            query += " AND user_status = ?";
            queryParams.push(user_status);

            query2 += " AND user_status = ?";
            queryParams2.push(user_status);
        }
        
        if(user_role)
        {
            query += " AND user_role = ?";
            queryParams.push(user_role);

            query2 += " AND user_role = ?";
            queryParams2.push(user_role);
        }

        query += " ORDER BY user_id DESC";

        if(page && perPage)
        {
            const offset = (page - 1) * perPage;
            query += " LIMIT ?, ?";
            queryParams.push(offset);
            queryParams.push(perPage);
        }

        const connection = await util.promisify(db.getConnection).bind(db)();

        try
        {
            const data = await util.promisify(connection.query).bind(connection)(query, queryParams);
            const total = await util.promisify(connection.query).bind(connection)(query2, queryParams2);

            /* PAGINATION DETAILS */

            //total records
            const totalRecords = parseInt(total[0].total_records);

            // Calculate total pages if perPage is specified
            const totalPages = perPage ? Math.ceil(totalRecords / perPage) : null;

            // Calculate next and previous pages based on provided page and totalPages
            const nextPage = page && totalPages && page < totalPages ? page + 1 : null;
            const prevPage = page && page > 1 ? page - 1 : null;

            res.json({
                error: false,
                data,
                paginationData: {
                    totalRecords,
                    totalPages,
                    currentPage: page,
                    itemsPerPage: perPage,
                    nextPage,
                    prevPage
                }
            })
        }
        catch(e)
        {
            res.json({
                error: true,
                message: e.message
            })
        }
        finally
        {
            connection.release();
        }
    },
    readOne: async (req, res) => {
        const {
            user_id
        } = req.params;

        let query = "SELECT * FROM users WHERE user_id = ? LIMIT 1";
        const queryParams = [ user_id ];

        const connection = await util.promisify(db.getConnection).bind(db)();

        try
        {
            const users = await util.promisify(connection.query).bind(connection)(query, queryParams);

            if(users.length === 0)
            {
                throw new Error("User record does not exist")
            }
    
            const user = users[0];

            res.json({
                error: false,
                user
            })
        }
        catch(e)
        {
            res.json({
                error: true,
                message: e.message
            })
        }
        finally
        {
            connection.release();
        }
    },
    update: async (req, res) => {
        const { user_id } = req.params;

        const {
            user_firstname,
            user_lastname,
            user_email,
            user_role,
            user_status
        } = req.body;

        const connection = await util.promisify(db.getConnection).bind(db)();

        try
        {
            //check if user exists 
            const users = await util.promisify(connection.query).bind(connection)("SELECT * FROM users WHERE user_email = ? AND user_id != ? LIMIT 1", [ user_email, user_id ]);

            if(users.length > 0)
            {
                throw new Error("The provided email address already exists");
            }

            const user = users[0];

            let updateQuery = `
                UPDATE users SET user_firstname = ?, 
                user_lastname = ?, 
                user_email = ?, 
                user_role = ?, 
                user_status = ? 
                WHERE user_id = ?
            `;

            let updateQueryParams = [ user_firstname, user_lastname, user_email, user_role, user_status, user_id ];

            //update user
            await util.promisify(connection.query).bind(connection)(updateQuery, updateQueryParams);

            res.json({
                error: false,
                message:'User updated successfully'
            })
        }
        catch(e)
        {   
            res.json({
                error:true,
                message:e.message
            })
        }
        finally
        {
            connection.release();
        }
    },
    deleteOne: async (req, res) => {
        const { user_id } = req.params;

        const connection = await util.promisify(db.getConnection).bind(db)();

        try
        {
            //check if user exists
            const users = await util.promisify(connection.query).bind(connection)("SELECT * FROM users WHERE user_id = ? LIMIT 1", [ user_id]);

            if(users.length === 0)
            {
                throw new Error(`No records found`);
            }

            //delete user
            await util.promisify(connection.query).bind(connection)("DELETE FROM users WHERE user_id = ?", [ user_id ]);

            res.json({
                error:false,
                message:"User deleted successfully"
            })
        }
        catch(e)
        {
            res.json({
                error: true,
                message:e.message
            })
        }
        finally
        {
            connection.release();
        }
    }
}