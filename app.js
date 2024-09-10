const express =  require('express');
const path = require('path');
const { title } = require('process');

const app = express();
const port = 3000;


// Middleware para analizar datos del formulario
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(__dirname + '/public')); 

app.get('/',(req, res)=>{
    res.render('index.ejs', {title: 'Inicio', view:'inicio'});
})

app.get('/productos', (req, res)=>{
    res.render('productosTable.ejs', {title:'Catálogo de Productos', view:'productos'})
})
app.get('/admin/producto-nuevo', (req, res)=>{
    res.render('productoNew.ejs', {title:'Catálogo de Productos', view:'productos'})
})

// Definir la ruta para mostrar el formulario de login
app.get('/admin', (req, res) => {
    res.render('login.ejs', { title: 'login' });
});

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

app.get('/admin/dashboard', (req, res)=>{
    res.render('dashboard.ejs', {title:'admin Dashboard', view:'productos'})
});

app.listen(port,()=>console.log('ingresastes al puesto ' + port));