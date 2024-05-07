const express = require('express');
const cors = require('cors');


const app = express();
app.use(express.json());
app.use(cors());
const port=3002;


// Definir un arreglo de objetos para representar productos informáticos
let products = [
    {
        id: 1,
        nombre: "Laptop",
        precio: 999.99,
        categorias: ["Computadoras", "Tecnología", "Portátiles"]
    },
    {
        id: 2,
        nombre: "Teclado mecánico",
        precio: 79.99,
        categorias: ["Periféricos", "Accesorios", "Tecnología"]
    },
    {
        id: 3,
        nombre: "Monitor ultrawide",
        precio: 499.99,
        categorias: ["Monitores", "Tecnología"]
    },
    {
        id: 4,
        nombre: "Disco duro SSD",
        precio: 129.99,
        categorias: ["Almacenamiento", "Tecnología"]
    },
    {
        id: 5,
        nombre: "Disco duro Mecanico",
        precio: 89.99,
        categorias: ["Almacenamiento", "Tecnología"]
    }
];

// Endpoint GET /productos con múltiples query parameters
app.get('/productos', (req, res) => {
    let resultado = products;

    // Filtrar por nombre si se proporciona el parámetro "nombre"
    if (req.query.nombre) {
        resultado = resultado.filter(producto => producto.nombre.toLowerCase()==(req.query.nombre.toLowerCase()));
    }

    // Filtrar por precio mínimo si se proporciona el parámetro "precioMinimo"
    if (req.query.precioMinimo) {
        resultado = resultado.filter(producto => producto.precio >= parseFloat(req.query.precioMinimo));
    }

    // Filtrar por precio máximo si se proporciona el parámetro "precioMaximo"
    if (req.query.precioMaximo) {
        resultado = resultado.filter(producto => producto.precio <= parseFloat(req.query.precioMaximo));
    }

    // Filtrar por categoría si se proporciona el parámetro "categoria"
    if (req.query.categoria) {
        resultado = resultado.filter(producto => producto.categorias.includes(req.query.categoria));
    }

    // Enviar el resultado como respuesta
    res.json(resultado);
});

// Endpoint GET /productos/categorias para agrupar y contar productos por categoría
app.get('/productos/categorias', (req, res) => {
    // Objeto para almacenar el conteo de productos por categoría
    const categoriasConteo = {};

    // Iterar sobre cada producto y actualizar el conteo por categoría
    products.forEach(producto => {
        producto.categorias.forEach(categoria => {
            if (categoriasConteo[categoria]) {
                categoriasConteo[categoria]++;
            } else {
                categoriasConteo[categoria] = 1;
            }
        });
    });

    // Enviar el objeto con el conteo de productos por categoría como respuesta
    res.json(categoriasConteo);
});

// Endpoint POST /productos/codificar para añadir un sufijo al nombre de un producto
app.post('/productos/codificar', (req, res) => {
    console.log(req.body)
    const { id, sufijo } = req.body;
    // Buscar el producto por ID
    const producto = products.find(p => p.id === id);

    // Si no se encuentra el producto, enviar un mensaje de error
    if (!producto) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Añadir el sufijo al nombre del producto
    producto.nombre += ` ${sufijo}`;

    // Devolver el producto modificado
    res.json(producto);
});

// Endpoint GET /productos/promedio para calcular el precio promedio
app.get('/productos/promedio', (req, res) => {
    let productosFiltrados = products;

    // Filtrar productos por categoría si se proporciona el parámetro "categoria" en la consulta
    if (req.query.categoria) {
        productosFiltrados = products.filter(producto => producto.categorias.includes(req.query.categoria));
    }

    // Calcular el precio promedio
    const totalProductos = productosFiltrados.length;
    if (totalProductos === 0) {
        return res.status(404).json({ error: "No se encontraron productos en la categoría especificada" });
    }

    const totalPrecio = productosFiltrados.reduce((total, producto) => total + producto.precio, 0);
    const precioPromedio = totalPrecio / totalProductos;

    // Devolver el precio promedio como respuesta
    res.json({ precioPromedio });
});

// Endpoint GET /productos/top para obtener los n primeros productos ordenados
app.get('/productos/top', (req, res) => {
    const { n, criterio } = req.query;

    // Validar los parámetros de consulta
    if (!n || !criterio || isNaN(parseInt(n)) || (criterio !== 'precioAsc' && criterio !== 'precioDesc')) {
        return res.status(400).json({ error: "Parámetros de consulta inválidos" });
    }

    // Ordenar productos según el criterio especificado
    let productosOrdenados = [];
    if (criterio === 'precioAsc') {
        productosOrdenados = products.sort((a, b) => a.precio - b.precio);
    } else if (criterio === 'precioDesc') {
        productosOrdenados = products.sort((a, b) => b.precio - a.precio);
    }

    // Tomar los n primeros productos
    const productosTop = productosOrdenados.slice(0, parseInt(n));

    // Devolver los productos top como respuesta
    res.json(productosTop);
});



app.listen(port,()=>{
    console.log(`Servidor Corriendo en el puerto ${port}`);
});
