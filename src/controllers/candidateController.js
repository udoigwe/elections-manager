const db = require('../utils/dbConfig');
const util = require('util');
const fs = require('fs').promises;
const FS = require('fs');
const sharp = require('sharp');
const { uuidv4 } = require('../utils/functions');

module.exports = {
    create: async (req, res) => {
        const {
            election_id,
            candidate_fullname,
            candidate_bio
        } = req.body;

        const now = Math.floor(Date.now() / 1000); 
        const acceptedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        const uploadPath = "public/images/avatars/";

        const connection = await util.promisify(db.getConnection).bind(db)();

        try
        {
            //check if election exists
            const elections = await util.promisify(connection.query).bind(connection)("SELECT * FROM elections WHERE election_id = ? LIMIT 1", [ election_id]);

            if(elections.length === 0)
            {
                throw new Error("The provided election does not exist")
            }
            
            if(!req.files || !req.files.avatar)
            {
                throw new Error("No image file uploaded");
            }

            const file = req.files.avatar;
            const filename = file.name;
            const fileMimeType = file.mimetype;
            const filePath = file.tempFilePath; // Get the temp file path
            const extensionPosition = filename.lastIndexOf('.');
            const extension = filename.substr(extensionPosition).toLowerCase();
            const newFileName = uuidv4() + extension;

            if(acceptedMimeTypes.indexOf(fileMimeType) === -1)
            {
                await fs.unlink(filePath);

                throw new Error('File attachment must be a jpg or png file');
            }
            
            if(file.size > (1024 * 1024))
            {
                await fs.unlink(filePath);

                throw new Error('File attachment must not be more than 1MB in size');
            }

            //upload image avatar
            await sharp(filePath).resize({height:200, width:200, fit:'cover'}).toFile(uploadPath + newFileName);

            //delete filepath
            await fs.unlink(filePath);

            //insert candidate into database
            await util.promisify(connection.query).bind(connection)(`
                INSERT INTO candidates (election_id, candidate_fullname, candidate_bio, candidate_avatar, candidate_created_at)
                VALUES (?, ?, ?, ?, ?)
            `, [ election_id, candidate_fullname, candidate_bio, newFileName, now ]);

            res.json({
                error: false,
                message:'Candidate created successfully'
            })
        }
        catch(e)
        {
            req.files && req.files.avatar ? await fs.unlink(req.files.avatar.tempFilePath) : '';
            
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
            candidate_status,
            election_id
        } = req.query;

        const page = req.query.page ? parseInt(req.query.page) : null;
        const perPage = req.query.perPage ? parseInt(req.query.perPage) : null;

        let query = "SELECT a.*, b.election_title FROM candidates a LEFT JOIN elections b ON a.election_id = b.election_id WHERE 1 = 1";
        const queryParams = [];

        let query2 = "SELECT COUNT(*) AS total_records FROM candidates a LEFT JOIN elections b ON a.election_id = b.election_id WHERE 1 = 1";
        const queryParams2 = [];

        if(candidate_status)
        {
            query += " AND a.candidate_status = ?";
            queryParams.push(candidate_status);

            query2 += " AND a.candidate_status = ?";
            queryParams2.push(candidate_status);
        }

        if(election_id)
        {
            query += " AND a.election_id = ?";
            queryParams.push(election_id);

            query2 += " AND a.election_id = ?";
            queryParams2.push(election_id);
        }

        query += " ORDER BY a.candidate_id DESC";

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

            for(let i = 0; i < data.length; i++)
            {
                const candidate = data[i];

                /* get total votes gathered by this candidate in the selected election*/
                const votes = await util.promisify(connection.query).bind(connection)("SELECT COUNT(*) AS votes FROM votes WHERE candidate_id = ? AND election_id = ?", [ candidate.candidate_id, candidate.election_id ]);

                candidate.votes = votes[0].votes;
            }

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
            candidate_id
        } = req.params;

        let query = "SELECT a.*, b.election_title FROM candidates a LEFT JOIN elections b ON a.election_id = b.election_id WHERE a.candidate_id = ? LIMIT 1";
        const queryParams = [ candidate_id ];

        const connection = await util.promisify(db.getConnection).bind(db)();

        try
        {
            const candidates = await util.promisify(connection.query).bind(connection)(query, queryParams);

            if(candidates.length === 0)
            {
                throw new Error("Candidate record does not exist")
            }
    
            const candidate = candidates[0];

            /* get total votes gathered by this candidate in the selected election*/
            const votes = await util.promisify(connection.query).bind(connection)("SELECT COUNT(*) AS votes FROM votes WHERE candidate_id = ? AND election_id = ?", [ candidate.candidate_id, candidate.election_id ]);

            candidate.votes = votes[0].votes;

            res.json({
                error: false,
                candidate
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
        const { candidate_id } = req.params;

        const {
            election_id,
            candidate_fullname,
            candidate_bio
        } = req.body;

        const acceptedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        const uploadPath = "public/images/avatars/";

        const connection = await util.promisify(db.getConnection).bind(db)();

        try
        {
            //check if candidate exists 
            const candidates = await util.promisify(connection.query).bind(connection)("SELECT a.*, b.election_title FROM candidates a LEFT JOIN elections b ON a.election_id = b.election_id WHERE a.candidate_id = ? LIMIT 1", [ candidate_id ]);

            //check if election exists
            const elections = await util.promisify(connection.query).bind(connection)("SELECT * FROM elections WHERE election_id = ? LIMIT 1", [ election_id]);

            if(candidates.length === 0)
            {
                throw new Error("Candidate not found");
            }

            if(elections.length === 0)
            {
                throw new Error("The provided election does not exist")
            }

            const candidate = candidates[0];
            const currentAvatarPath = uploadPath + candidate.candidate_avatar;

            let updateQuery = "UPDATE candidates SET election_id = ?, candidate_fullname = ?, candidate_bio = ?";
            let updateQueryParams = [ election_id, candidate_fullname, candidate_bio ];

            if(req.files && req.files.avatar)
            {
                const file = req.files.avatar;
                const filename = file.name;
                const fileMimeType = file.mimetype;
                const filePath = file.tempFilePath; // Get the temp file path
                const extensionPosition = filename.lastIndexOf('.');
                const extension = filename.substr(extensionPosition).toLowerCase();
                const newFileName = uuidv4() + extension;
                
                if(acceptedMimeTypes.indexOf(fileMimeType) === -1)
                {
                    await fs.unlink(filePath);
    
                    throw new Error('File attachment must be a jpg or png file');
                }
                
                if(file.size > (1024 * 1024))
                {
                    await fs.unlink(filePath);
    
                    throw new Error('File attachment must not be more than 1MB in size');
                }
                
                if(FS.existsSync(currentAvatarPath))
                {
                    //delete current avatar file
                    await fs.unlink(currentAvatarPath);
                }
    
                //upload image avatar
                await sharp(filePath).resize({height:200, width:200, fit:'cover'}).toFile(uploadPath + newFileName);
    
                //delete filepath
                await fs.unlink(filePath);

                //update the query string
                updateQuery += `, candidate_avatar = ?`;
                updateQueryParams.push(newFileName);
            }

            updateQuery += ` WHERE candidate_id = ?`;
            updateQueryParams.push(candidate_id);

            //update candidate
            await util.promisify(connection.query).bind(connection)(updateQuery, updateQueryParams);

            res.json({
                error: false,
                message:'Candidate updated successfully'
            })
        }
        catch(e)
        {
            req.files && req.files.avatar ? await fs.unlink(req.files.avatar.tempFilePath) : '';
            
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
        const { candidate_id } = req.params;

        const uploadPath = 'public/images/avatars/';

        const connection = await util.promisify(db.getConnection).bind(db)();

        try
        {
            //check if candidate exists
            const candidates = await util.promisify(connection.query).bind(connection)("SELECT * FROM candidates WHERE candidate_id = ? LIMIT 1", [ candidate_id]);

            if(candidates.length === 0)
            {
                throw new Error(`No records found`);
            }

            if(FS.existsSync(uploadPath + candidates[0].candidate_avatar))
            {
                //delete current avatar file
                await fs.unlink(uploadPath + candidates[0].candidate_avatar);
            }

            //delete candidate
            await util.promisify(connection.query).bind(connection)("DELETE FROM candidates WHERE candidate_id = ?", [ candidate_id ]);

            res.json({
                error:false,
                message:"Candidate deleted successfully"
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