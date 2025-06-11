const express = require('express');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const coreAuthRouter = require('./routes/coreRoutes/coreAuth');
const coreApiRouter = require('./routes/coreRoutes/coreApi');
const coreDownloadRouter = require('./routes/coreRoutes/coreDownloadRouter');
const corePublicRouter = require('./routes/coreRoutes/corePublicRouter');
const adminAuth = require('./controllers/coreControllers/adminAuth');
const errorHandlers = require('./handlers/errorHandlers');
const erpApiRouter = require('./routes/appRoutes/appApi');
const fileUpload = require('express-fileupload');
const campaignController = require('./controllers/campaignController');

const app = express();

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(compression());

// Định nghĩa route campaign summary trước các route /api để tránh ghi đè
app.get('/api/campaign/summary', (req, res, next) => {
  console.log('Route /api/campaign/summary called at', new Date().toISOString());
  campaignController.summary(req, res, next);
});

// Các route campaign khác
app.get('/api/campaign/listAll', campaignController.listAll);
app.post('/api/campaign/create', campaignController.create);
app.put('/api/campaign/update/:id', campaignController.update);
app.delete('/api/campaign/delete/:id', campaignController.delete);
app.get('/api/campaign/read/:id', campaignController.read);
app.patch('/api/registrations/:registrationId/approve', campaignController.approveRegistration);
app.get('/api/campaign/:campaignId/clients', campaignController.getClientsByCampaign);

app.use('/api', coreAuthRouter);
app.use('/api', adminAuth.isValidAuthToken, coreApiRouter);
app.use('/api', adminAuth.isValidAuthToken, erpApiRouter);
app.use('/download', coreDownloadRouter);
app.use('/public', corePublicRouter);

//app.use(errorHandlers.notFound);

// Trong app.js, thay middleware notFound bằng:
app.use(
  (errorHandlers.notFound = (req, res, next) => {
    console.log(`Not found: ${req.originalUrl}`);
    res.status(404).json({ error: 'Not Found' });
  })
);

app.use(errorHandlers.productionErrors);

module.exports = app;
