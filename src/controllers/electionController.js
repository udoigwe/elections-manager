const db = require('../utils/dbConfig');
const util = require('util');
const { slugify } = require('../utils/functions');

module.exports = {
    create: async (req, res) => {
        const {
            election_title
        } = req.body;

        const now = Math.floor(Date.now() / 1000); 

        const connection = await util.promisify(db.getConnection).bind(db)();

        try 
        {
            //get election slug
            const electionSlug = slugify(election_title);

            //check if election title exists
            const elections = await util.promisify(connection.query).bind(connection)("SELECT * FROM elections WHERE election_slug = ? LIMIT 1", [electionSlug]);

            if(elections.length > 0)
            {
                throw new Error(`${election_title} already exists`);
            }

            //insert election into database
            await util.promisify(connection.query).bind(connection)(`
                INSERT INTO elections (election_title, election_slug, election_created_at)
                VALUES (?, ?, ?)
            `, [election_title, electionSlug, now]);

            res.json({
                error: false,
                message: "Election created successfully"
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
    update: async (req, res) => {
        const { election_id } = req.params;

        const {
            election_title
        } = req.body;

        const connection = await util.promisify(db.getConnection).bind(db)();

        try 
        {
            //get election slug
            const electionSlug = slugify(election_title);

            //check if election title exists
            const elections = await util.promisify(connection.query).bind(connection)(`SELECT * FROM elections WHERE election_slug = ? AND election_id != ? LIMIT 1`, [electionSlug, election_id]);

            if(elections.length > 0)
            {
                throw new Error(`${election_title} already exists`);
            }

            //update election
            await util.promisify(connection.query).bind(connection)(`
                UPDATE elections SET election_title = ?, 
                election_slug = ?
                WHERE election_id = ?
            `, [election_title, electionSlug, election_id]);

            res.json({
                error: false,
                message: "Election updated successfully"
            })
        }
        catch(e)
        {console.log(e.stack)
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
            election_status
        } = req.query;

        const page = req.query.page ? parseInt(req.query.page) : null;
        const perPage = req.query.perPage ? parseInt(req.query.perPage) : null;

        let query = "SELECT * FROM elections WHERE 1 = 1";
        const queryParams = [];

        let query2 = "SELECT COUNT(*) AS total_records FROM elections WHERE 1 = 1";
        const queryParams2 = [];

        if(election_status)
        {
            query += " AND election_status = ?";
            queryParams.push(election_status);

            query2 += " AND election_status = ?";
            queryParams2.push(election_status);
        }

        query += " ORDER BY election_id DESC";

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
            election_id
        } = req.params;

        let query = "SELECT * FROM elections WHERE election_id = ? LIMIT 1";
        const queryParams = [election_id];

        const connection = await util.promisify(db.getConnection).bind(db)();

        try
        {
            const elections = await util.promisify(connection.query).bind(connection)(query, queryParams);
            
            if(elections.length === 0)
            {
                throw new Error(`No records found`)
            }

            res.json({
                error: false,
                election:elections[0]
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
    deleteOne: async (req, res) => {
        const { election_id } = req.params;

        const connection = await util.promisify(db.getConnection).bind(db)();

        try
        {
            //check if election exists
            const elections = await util.promisify(connection.query).bind(connection)("SELECT * FROM elections WHERE election_id = ? LIMIT 1", [ election_id]);

            if(elections.length === 0)
            {
                throw new Error(`No records found`);
            }

            //delete election
            await util.promisify(connection.query).bind(connection)("DELETE FROM elections WHERE election_id = ?", [ election_id ]);

            res.json({
                error:false,
                message:"Election deleted successfully"
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