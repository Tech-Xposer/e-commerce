const express = require('express')
const {
    listProduct,
    getProductByID,
    addProduct,
    deleteProductByID,
    deleteProducts,
    updateProduct
} = require('../controller/productController')
const productRouter = express.Router()

productRouter.get('/',listProduct)

productRouter
    .route('/:id')
    .get(getProductByID)
    .delete(deleteProductByID)
    .patch(updateProduct);

productRouter.post('/newproduct',addProduct);

productRouter.delete('/deleteproducts',deleteProducts);


module.exports = productRouter