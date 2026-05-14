const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const productImageRoutes = require('./routes/productImages');
const orderRoutes = require('./routes/orders');
const supplierRoutes = require('./routes/suppliers');
const purchaseOrderRoutes = require('./routes/purchaseOrders');
const ingredientRoutes = require('./routes/ingredients');
const uploadRoutes = require('./routes/upload');
const siteContentRoutes = require('./routes/siteContent');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/products', productImageRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/purchase-orders', purchaseOrderRoutes);
app.use('/api/ingredients', ingredientRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/site', siteContentRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Sharafs Sweets API is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});