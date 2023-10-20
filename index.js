//accessing & configuring environmental variables
const dotenv = require('dotenv');
dotenv.config();
//Accepting from unauthorized
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

//variables
const express = require('express');
const app = express();
const port = process.env.PORT || 8701;
const cors = require('cors');
const fileUpload = require('express-fileupload');
const useragent = require('express-useragent');
const path = require("path");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const yaml = require('js-yaml');
const fs = require('fs');
const expressLayouts = require('express-ejs-layouts');

//using middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(useragent.express());
app.use(fileUpload({useTempFiles: true, limits: { fileSize: 50 * 1024 * 1024 * 1024 }}));

//static files
app.use(express.static(__dirname + '/public'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/vendor', express.static(__dirname + '/public/vendor'));
app.use('/images', express.static(__dirname + '/public/images'));

//set templating engine
app.use(expressLayouts);
app.set('layout', './layouts/default.layout')
app.set('view engine', 'ejs');

//importing all required routes
const authRoutes = require('./src/routes/auth');
const electionRoutes = require('./src/routes/election');
const candidateRoutes = require('./src/routes/candidate');
const voteRoutes = require('./src/routes/vote');
const dashboardRoutes = require('./src/routes/dashboard');
const userRoutes = require('./src/routes/user');

//importing all view routes
const viewRoutes = require('./src/routes/views')

// Parse YAML Swagger documentation to JSON
const swaggerFile = fs.readFileSync('./src/documentation/swagger.yaml', 'utf8');
const swaggerDocument = yaml.load(swaggerFile);

//using imported routes
app.use(process.env.ROUTE_PREFIX, authRoutes);
app.use(process.env.ROUTE_PREFIX, electionRoutes);
app.use(process.env.ROUTE_PREFIX, candidateRoutes);
app.use(process.env.ROUTE_PREFIX, voteRoutes);
app.use(process.env.ROUTE_PREFIX, dashboardRoutes);
app.use(process.env.ROUTE_PREFIX, userRoutes);

//using imported view routes
app.use(viewRoutes);

// Serve Swagger documentation at /api/docs
app.use(process.env.API_DOCS_ROUTE_PREFIX, swaggerUi.serve);
app.get(process.env.API_DOCS_ROUTE_PREFIX, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
    console.log(`App successfully running on port ${port}`);
})