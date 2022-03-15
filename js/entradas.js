/* Arreglo que contiene los productos */
const productos = [];
/* Arreglo que contiene los productos del carrito */
const carrito=[];
const cantidadCarrito = document.getElementById('cantidad');
const productosCarrito = document.getElementById('productosCarrito');
const confirmar = document.getElementById('confirmar');
let registroProducto = document.getElementById("registroProducto");
let divProductos = document.getElementById("productos");
const totalCarritoInterfaz=document.getElementById('totalCarrito');


fetch("productos/productos.json")
  .then(respuesta => respuesta.json())
  .then(data =>{
    console.log(data);
    //Transformo de objeto literal a objeto Producto
    for (const literal of data) {
      productos.push(new Producto(literal.id, literal.nombre, literal.precio,literal.genero,literal.img,literal.cantidad));
   
    }
    console.log(productos);
    //GENERAR INTERFAZ DE PRODUCTOS CON UNA FUNCION
    productosHTML(productos, 'productosCarrito');
  }).catch(mensaje=> console.error(mensaje))



let saldoCliente=1000000;