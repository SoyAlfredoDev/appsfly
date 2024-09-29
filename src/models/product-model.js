const mongoose = require('mongoose');
const { Schema } = mongoose;  // Extrae Schema del módulo mongoose

// Define el esquema para el producto
const productSchema = new Schema({
    productKey: { type: String, required: true, unique: true },  // Clave única
    productID: { type: String, required: true },  // Identificador único del producto
    productName: { type: String, required: true }, // Nombre del producto
    productDescription: { type: String }, // Descripción del producto 
    productPrice: { type: Number, required: true }, // Precio del producto
    productRecommended: { type: Boolean, required: true }, // Indicador de recomendación
    productCategory: { type: String, required: true }, // Categoría del producto
    productImagen:{ type: String, required: true } // Categoría del producto
});

// Crea el modelo basado en el esquema
const Product = mongoose.model('Product', productSchema);

// Exporta el modelo para su uso en otras partes de la aplicación
module.exports = Product;
