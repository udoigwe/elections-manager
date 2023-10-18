const db = require('../utils/dbConfig');
const util = require('util');

module.exports = {
    dashboard: async (req, res) => {
        let activeUsers = 0;
        let inactiveUsers = 0;
        let activeCandidates = 0;
        let inactiveCandidates = 0;
        let activeElections = 0;
        let inactiveElections = 0;

        const query = "SELECT user_status, COUNT(*) AS users_count FROM users GROUP BY user_status";
        const query2 = "SELECT candidate_status, COUNT(*) AS candidates_count FROM candidates GROUP BY candidate_status";
        const query3 = "SELECT election_status, COUNT(*) AS elections_count FROM elections GROUP BY election_status";
        const query4 = "SELECT COUNT(*) AS votes_count FROM votes";

        const connection = await util.promisify(db.getConnection).bind(db)();

        try
        {
            const userGroups = await util.promisify(connection.query).bind(connection)(query);
            const candidateGroups = await util.promisify(connection.query).bind(connection)(query2);
            const electionGroups = await util.promisify(connection.query).bind(connection)(query3);
            const votes = await util.promisify(connection.query).bind(connection)(query4);

            for(let i = 0; i < userGroups.length; i++)
            {
                const userGroup = userGroups[i];
                userGroup.user_status === "Active" ? activeUsers += userGroup.users_count : userGroup.users_count === "Inactive" ? inactiveUsers += 1 : null;
            }

            for(let i = 0; i < candidateGroups.length; i++)
            {
                const candidateGroup = candidateGroups[i];
                candidateGroup.candidate_status === "Active" ? activeCandidates += 1 : candidateGroup.candidates_count === "Inactive" ? inactiveCandidates += candidateGroup.candidates_count : null;
            }

            for(let i = 0; i < electionGroups.length; i++)
            {
                const electionGroup = electionGroups[i];
                electionGroup.election_status === "Active" ? activeElections += electionGroup.elections_count : electionGroup.election_status === "Inactive" ? inactiveElections += electionGroup.elections_count : null;
            }

            const dashboard = {
                activeUsers,
                inactiveUsers,
                activeCandidates,
                inactiveCandidates,
                activeElections,
                inactiveElections,
                total_votes:votes[0].votes_count
            }

            res.json({
                error:false,
                dashboard
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
    }
}