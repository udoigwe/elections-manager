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

    /* Admin Routes */
    adminDashboard: async (req, res) => {
        res.render('admin/index', { title:'Admin | Dashboard', layout: './layouts/admin'})
    }
}