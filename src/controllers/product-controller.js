// product-controller.js
const Product = require('../models/product-model.js');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('node:fs');

const getProduct = async () => {
    try {
        const products = await Product.find();  // Encuentra todos los productos
        return products;  // Retorna los productos para usarlos en otra parte
    } catch (e) {
        console.error(e);
        throw e;
    }
};

const getProductByKey = async(key)=>{
    try {
        const productByID = await Product.findOne({productKey:key}) ;
        return productByID;
    } catch (e) {
        console.log(e);
        throw e;       
    }
}

const createProduct = async(req) => {
    try {
        // Destructura los campos del cuerpo de la solicitud
        const { productID, productName, productDescription, productPrice, productRecommended, productCategory } = req.body;
        
        // Genera una clave única para el producto
        const productKey = uuidv4();
        
        // Ruta de la imagen subida (usando Multer, req.file)
        const originalPath = req.file.path; // Ruta temporal proporcionada por Multer
        const newPath = `./public/uploads/img-${productKey}.jpg`; // Ruta final en la carpeta public/uploads
        
        // Crea un nuevo producto
        const newProduct = new Product({
            productKey,
            productID,
            productName,
            productDescription,
            productPrice,
            productRecommended: productRecommended || false,
            productCategory,
            productImagen: `uploads/img-${productKey}.jpg`, // Guardamos la nueva ruta
        });
        
        // Mueve la imagen subida a la nueva ruta
        fs.renameSync(originalPath, newPath);
        
        // Guarda el nuevo producto en la base de datos
        await newProduct.save();
        
    } catch (e) {
        console.log(e);
        throw e;
    }
};

const deteteProduct = async(productoID)=>{
    try {     
        Product.deleteOne({  productID:productoID })
        console.log('delete')   
    } catch (e) {
        console.log(e);
        throw e; 
    }
};

const updateProduct = async(req, key)=>{
    try {
        const { productID, productName, productDescription, productPrice, productRecommended, productCategory } = req.body;
        console.log(productRecommended)
        const product = await Product.findOne({productKey:key})
        product.productID = productID || product.productID;
        product.productName = productName || product.productName;
        product.productDescription = productDescription || product.productDescription;
        product.productPrice = productPrice || product.productPrice;
        product.productRecommended = productRecommended == 'true' ? true : false;
        product.productCategory = productCategory || product.productCategory
        
        await product.save()        
    } catch (e) {
        console.log(e);
        throw e;        
    }

}

// functions
function saveImagen(req){
    
    return newPath;
}


module.exports = { getProduct , createProduct, deteteProduct, getProductByKey, updateProduct};
