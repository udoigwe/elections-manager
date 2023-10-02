const db = require('../utils/dbConfig');
const util = require('util');
const requestIp = require('request-ip');

module.exports = {
    create: async (req, res) => {
        const {
            election_id,
            candidate_id,
        } = req.body;

        const voter_id = req.userDecodedData.user_id;

        const now = Math.floor(Date.now() / 1000);
        const clientIP = requestIp.getClientIp(req);
        //get user-agent
        const userAgent = req.useragent;

        const connection = await util.promisify(db.getConnection).bind(db)();

        try
        {
            //check if election exists
            const electionQuery = "SELECT * FROM elections WHERE election_id = ? LIMIT 1";
            const electionQueryParams = [ election_id ];

            //check if candidate exists
            const candidateQuery = "SELECT * FROM candidates WHERE candidate_id = ? LIMIT 1";
            const candidateQueryParams = [ candidate_id ];

            //check if voter has voted for this election
            let query = "SELECT * FROM votes WHERE voter_id = ? AND election_id = ?";
            const queryParams = [ voter_id, election_id ];

            if(process.env.NODE_ENV === 'production')
            {
                //we will be checking for IP Addresses & user agents in a production environment
                query += " AND ip_address = ? AND user_agent = ?";
                queryParams.push(clientIP);
                queryParams.push(userAgent.source);
            }

            query += " LIMIT 1";

            const elections = await util.promisify(connection.query).bind(connection)(electionQuery, electionQueryParams);
            const candidates = await util.promisify(connection.query).bind(connection)(candidateQuery, candidateQueryParams);
            const votes = await util.promisify(connection.query).bind(connection)(query, queryParams);

            if(elections.length === 0)
            {
                throw new Error("The selected election does not exist");
            }

            if(elections[0].election_status === "Inactive")
            {
                throw new Error("The selected election is currently closed");
            }

            if(candidates.length === 0)
            {
                throw new Error("Your preffered candidate does not exist");
            }

            if(candidates[0].candidate_status === "Inactive")
            {
                throw new Error("Your preffered candidate is currently disqualified");
            }

            if(candidates[0].election_id !== election_id)
            {
                throw new Error("Your preffered candidate is not contesting in this election")
            }

            if(votes.length > 0)
            {
                throw new Error("Sorry!!! You cannot vote twice in an election")
            }

            //insert vote into database
            await util.promisify(connection.query).bind(connection)(`
                INSERT INTO votes (election_id, voter_id, candidate_id, ip_address, user_agent, vote_timestamp)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [ election_id, voter_id, candidate_id, clientIP, userAgent.source, now ]);

            res.json({
                error:false,
                message:"Vote casted successfully. Your vote will count"
            });
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
            election_id,
            voter_id,
            candidate_id
        } = req.query;

        const page = req.query.page ? parseInt(req.query.page) : null;
        const perPage = req.query.perPage ? parseInt(req.query.perPage) : null;

        let query = `
            SELECT a.*, 
            b.election_title,
            CONCAT(c.user_firstname,' ',c.user_lastname) AS voter_name,
            d.candidate_fullname
            FROM votes a
            LEFT JOIN elections b ON a.election_id = b.election_id
            LEFT JOIN users c ON a.voter_id = c.user_id
            LEFT JOIN candidates d ON a.candidate_id = d.candidate_id 
            WHERE 1 = 1
        `;
        const queryParams = [];

        let query2 = `
            SELECT COUNT(*) AS total_records 
            FROM votes a
            LEFT JOIN elections b ON a.election_id = b.election_id
            LEFT JOIN users c ON a.voter_id = c.user_id
            LEFT JOIN candidates d ON a.candidate_id = d.candidate_id 
            WHERE 1 = 1
        `;
        const queryParams2 = [];

        if(election_id)
        {
            query += " AND a.election_id = ?";
            queryParams.push(election_id);

            query2 += " AND a.election_id = ?";
            queryParams2.push(election_id);
        }

        if(voter_id)
        {
            query += " AND a.voter_id = ?";
            queryParams.push(voter_id);

            query2 += " AND a.voter_id = ?";
            queryParams2.push(voter_id);
        }

        if(candidate_id)
        {
            query += " AND a.candidate_id = ?";
            queryParams.push(candidate_id);

            query2 += " AND a.candidate_id = ?";
            queryParams2.push(candidate_id);
        }

        query += " ORDER BY vote_id DESC";

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
            vote_id
        } = req.params;

        let query = `
            SELECT a.*, 
            b.election_title,
            CONCAT(c.user_firstname,' ',c.user_lastname) AS voter_name,
            d.candidate_fullname
            FROM votes a
            LEFT JOIN elections b ON a.election_id = b.election_id
            LEFT JOIN users c ON a.voter_id = c.user_id
            LEFT JOIN candidates d ON a.candidate_id = d.candidate_id 
            WHERE a.vote_id = ?
        `;
        const queryParams = [vote_id];

        const connection = await util.promisify(db.getConnection).bind(db)();

        try
        {
            const votes = await util.promisify(connection.query).bind(connection)(query, queryParams);
            
            if(votes.length === 0)
            {
                throw new Error(`No records found`)
            }

            res.json({
                error: false,
                vote:votes[0]
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
    readRanks: async (req, res) => {
        const {
            election_id,
            candidate_id
        } = req.query;

        const page = req.query.page ? parseInt(req.query.page) : null;
        const perPage = req.query.perPage ? parseInt(req.query.perPage) : null;

        let query = `
            SELECT *, 
            @rank := @rank + 1 AS rank 
            FROM ( 
                SELECT a.candidate_id, 
                a.election_id, 
                b.candidate_fullname, 
                c.election_title, 
                COUNT(*) AS entry_count 
                FROM votes a 
                LEFT JOIN candidates b ON a.candidate_id = b.candidate_id 
                LEFT JOIN elections c ON a.election_id = c.election_id 
                GROUP BY a.candidate_id, 
                a.election_id, 
                b.candidate_fullname, 
                c.election_title 
                ORDER BY entry_count DESC 
            ) ranked, (SELECT @rank := 0) r
            WHERE 1 = 1
        `;
        const queryParams = [];

        let query2 = `
            SELECT COUNT(*) AS total_records
            FROM (
                SELECT *, 
                @rank := @rank + 1 AS rank 
                FROM ( 
                    SELECT a.candidate_id, 
                    a.election_id, 
                    b.candidate_fullname, 
                    c.election_title, 
                    COUNT(*) AS entry_count 
                    FROM votes a 
                    LEFT JOIN candidates b ON a.candidate_id = b.candidate_id 
                    LEFT JOIN elections c ON a.election_id = c.election_id 
                    GROUP BY a.candidate_id, 
                    a.election_id, 
                    b.candidate_fullname, 
                    c.election_title 
                    ORDER BY entry_count DESC 
                ) ranked, (SELECT @rank := 0) r
            ) X WHERE 1 = 1
        `;

        const queryParams2 = [];

        if(election_id)
        {
            query += " AND election_id = ?";
            queryParams.push(election_id);

            query2 += " AND election_id = ?";
            queryParams2.push(election_id);
        }

        if(candidate_id)
        {
            query += " AND candidate_id = ?";
            queryParams.push(candidate_id);

            query2 += " AND candidate_id = ?";
            queryParams2.push(candidate_id);
        }

        query += " ORDER BY rank ASC";

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
}