const express =  require('express');
const session = require('express-session');
const path = require('path');
const multer = require('multer');
const mongoose = require('mongoose');
const upload = multer({ dest: 'public/uploads/' });
const fs = require('node:fs');
const { getProduct, createProduct,  deteteProduct, getProductByKey, updateProduct} = require('./src/controllers/product-controller.js');
const Product = require('./src/models/product-model.js');

const app = express();
const port = 3000;



const mongoUrl = "mongodb+srv://appsfly:4142Lufe@apssfly001.tpkhy.mongodb.net/?retryWrites=true&w=majority&appName=apssfly001";
mongoose.connect(mongoUrl)
.then(() => console.log('Conexión exitosa a MongoDB'))
.catch(err => console.error('Error al conectar a MongoDB', err));


app.use(session({
    secret: 'tu-clave-secreta', // Cambia esto a algo más seguro
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Asegúrate de que sea true si estás usando HTTPS
  }));

// Middleware para analizar datos del formulario
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(__dirname + '/public')); 

app.get('/', async (req, res)=>{   
    const products = await getProduct();
    res.render('index.ejs', {title: 'Inicio', view:'inicio', products});
})

app.get('/productos', async (req, res)=>{
    const products = await getProduct();
    res.render('product-gallery.ejs', {title:'Catálogo de Productos', view:'productos', products})
})

// Definir la ruta para mostrar el formulario de login
app.get('/admin', (req, res) => {
    res.render('login.ejs', { title: 'login' });
});

//agergar producto en la bd 
app.post('/admin/update/newProduct', upload.single('productImagen') ,async (req, res)=>{
    try {
        await createProduct(req)
        res.redirect('/admin/dashboard');

    } catch (e) {
        console.log(e)
        throw e;
    }
})

app.post('/admin', async (req, res)=>{
    try {
        // Obtener el correo del usuario del formulario de login
        const userEmail = req.body.userEmail.toLowerCase();

        if (userEmail === 'opticaycristal@gmail.com') {
            // Obtener la contraseña del usuario del formulario de login
            const userPlainPassword = req.body.userPassword;

            // Validar la contraseña
            //const match = await bcrypt.compare(userPlainPassword, userHashedPassword);
            if (userPlainPassword == '101010' ) {
                // Establecer las sesiones del usuario
                req.session.userEmail = 'opticaycristal@gmail.com';
                req.session.userName = 'Óptica y Cristal Limitada';
                res.redirect('/admin/dashboard');
            } else {
                // Agregar mensaje flash en caso de contraseña incorrecta
                //req.flash('error', 'Contraseña no coincide');
                res.redirect('/admin');
            }
        } else {
            // Agregar mensaje flash en caso de email no encontrado
            //req.flash('error', 'Email no encontrado');
            res.redirect('/admin');
        } 
        
    } catch (e) {
        console.log(e)
        res.send('error interno del servidor')
        
    }

});

app.get('/admin/dashboard', async (req, res)=>{
    const products = await getProduct();
    res.render('dashboard.ejs', {title:'admin Dashboard', view:'productos', products})
});

app.get('/admin/delete/:productID', async(req, res)=>{
    try {
        const productID = req.params.productID
        await deteteProduct(productID)
        console.log('eliminado', productID)
        res.redirect('/admin/dashboard') 
    } catch (e) {
        console.log(e);
        throw e;        
    }
})

app.get('/admin/edit/:productKey', async(req, res)=>{
    try {
        const productKey = req.params.productKey
        const productByKey = await getProductByKey (productKey)
        if(productByKey){
            res.render('productoView.ejs', {title:'admin Dashboard', view:'productos', productByKey, viewType:'edit'} ) 
        }else{
            res.redirect('/admin/dashboard')
        }
        
    } catch (e) {
        console.log(e);
        throw e;        
    }
})

app.get('/jornada-oftalmologica', async(req, res)=>{
    try {
        res.render('jornada-oftamologica.ejs', {title:'Jornada Oftalmolócgica', view:'jornada-oftalmologica', viewType:'view'} )
    } catch (e) {
        console.log(e);
        throw e;
        
    }
})

app.post('/admin/update/:productoID', async (req, res)=>{
    try {
        const productID = req.params.productoID
        await updateProduct(req, productID)
        res.redirect(`/admin/edit/${productID}`)
    } catch (e) {
        console.log(e);
        throw e;        
    }
})

app.get('/productos/:productID', async(req, res)=>{
    try {
        const productID = req.params.productID;        
        const productByKey = await getProductByKey(productID)
        if(productByKey ){
            res.render('product-gallery-view.ejs', {title:'Producto', productByKey, view:'productos', viewType:'edit'} ) 
        }else{
            res.redirect('/');
        }        
    } catch (e) {
        console.log(e);
        throw e;        
    }
})

app.listen(port,()=>console.log('ingresastes al puesto ' + port));