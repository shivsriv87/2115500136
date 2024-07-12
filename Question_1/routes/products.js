// routes/products.js
const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const config = require('../config');

const router = express.Router();

const fetchProductsFromCompany = async (categoryName) => {
  const url = `${config.testServerUrl}/test/${categoryName}/products`;
  const headers = { 'Authorization': `Bearer ${config.accessToken}` };
  
  try {
    const response = await axios.get(url, { headers });
    return response.data.products.map(product => ({
      ...product,
      id: uuidv4() // Generate a custom unique identifier
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

router.get('/:categoryName/products', async (req, res) => {
  const { categoryName } = req.params;
  const { n = 10, page = 1, sort, order } = req.query;

  try {
    let products = await fetchProductsFromCompany(categoryName);

    if (sort) {
      products = products.sort((a, b) => {
        if (order === 'desc') {
          return b[sort] - a[sort];
        }
        return a[sort] - b[sort];
      });
    }

    const startIndex = (page - 1) * n;
    const paginatedProducts = products.slice(startIndex, startIndex + parseInt(n));

    res.json(paginatedProducts);
  } catch (error) {
    res.status(500).send('Error fetching products');
  }
});

router.get('/:categoryName/products/:productId', async (req, res) => {
  const { categoryName, productId } = req.params;

  try {
    const products = await fetchProductsFromCompany(categoryName);
    const product = products.find(p => p.id === productId);

    if (!product) {
      return res.status(404).send('Product not found');
    }

    res.json(product);
  } catch (error) {
    res.status(500).send('Error fetching product details');
  }
});

module.exports = router;
