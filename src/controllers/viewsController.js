module.exports = {

    /* Authentication Routes */
    signin: async (req, res) => {
        res.render('signin', { title:'Sign In', layout: './layouts/default'})
    },
    register: async (req, res) => {
        res.render('register', { title:'Register', layout: './layouts/default'})
    },
    home: async (req, res) => {
        res.render('index', { title:'Home', layout: './layouts/default'})
    },

    /* Admin Controllers */
    adminDashboard: async (req, res) => {
        res.render('admin/index', { title:'Admin | Dashboard', layout: './layouts/admin'})
    },
    candidates: async (req, res) => {
        res.render('admin/candidates', { title:'Admin | Candidates', layout: './layouts/admin' })
    },
    votes: async (req, res) => {
        res.render('admin/votes', { title:'Admin | Votes', layout: './layouts/admin' })
    },
    users: async (req, res) => {
        res.render('admin/users', { title:'Admin | Users', layout: './layouts/admin' })
    },

    /* Voter Controllers */
    voterDashboard: async (req, res) => {
        res.render('voter/index', { title:'Voter | Dashboard', layout: './layouts/voter'})
    },
}