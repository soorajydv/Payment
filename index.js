import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import path from 'path';
import { engine } from 'express-handlebars';

import paymentRoutes from './src/routes/payment.routes.js';

const app = express();
app.use(express.json());
app.use(cors());

// Set the public directory for static files
app.use(express.static(path.resolve('public')));

// Set up Handlebars as the templating engine
app.engine('handlebars', engine({ defaultLayout: false }));
app.set('view engine', 'handlebars');
app.set('views', './src/views');

// Routes
app.get('/',(req,res)=>res.render('payment'));
app.use('/payment', paymentRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
