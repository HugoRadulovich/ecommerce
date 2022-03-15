 /* MI IDEA SERIA HACER UN ECOMMERCE DE ZAPATILLAS,ROPA ESTILO GRID, ADIDAS, NIKE */



//DECLARACIÓN DE CLASE PRODUCTO
class Producto {
        constructor(id,nombre,precio,genero,img, cantidad) {
                this.id = parseInt(id);
                this.nombre = nombre.toUpperCase();
                this.precio = parseFloat(precio);
                this.genero = genero;
                this.img= img;
                this.cantidad= cantidad || 1;
        }
        addCantidad(){
            this.cantidad++;                
        }
        subTotal(){
            return this.precio * this.cantidad;                
        }
        agregarCantidad(valor){
            this.cantidad += valor;
        }
        
    }




/* Preguntamos si tenemos informacion en el LocalStorage y la traemos devuelta en caso de ser verdadero */
if ('Productos' in localStorage) {
        const guardados = JSON.parse(localStorage.getItem("Productos"));
        console.log(guardados);
        for (const generico of guardados) {
                productos.push(new Producto(generico.nombre,generico.precio,generico.categoria,generico.genero,generico.img))
        }
        console.log(productos);
        console.log(...productos); /* ejemplo de Spread */
        productosHTML(productos);

}




/* Listamos los productos disponibles */
function productosHTML(lista) {
        divProductos.innerHTML="";
        for (const producto of lista) {
                let divProd = document.createElement('div');
                divProd.classList.add('col')
                divProd.innerHTML = `<div class=" ms-5 card w-75">
                <img src="${producto.img}" class="card-img-top" alt="...">
                <div class="card-body">
                  <h5 class="card-title text-center">${producto.nombre}</h5>
                  <p class="card-text">USD$: ${producto.precio}</p>
                  <div class="d-grid gap-2 col-6 mx-auto">
                  <button id='${producto.id}' class ='btnCompra btn btn-dark'>Comprar</button>
                  </div>
                  
                </div>
                 `
                divProductos.append(divProd);
        }
        eventoBoton();
}



/* Filtro para podes buscar los productos por nombre */
const filtroProducto = document.getElementById('filtroProducto');
filtroProducto.addEventListener('input',function(){
        const filtrados = productos.filter( producto => producto.nombre.includes(this.value.toUpperCase()));
        console.log(filtrados);
        productosHTML(filtrados);
})

/* Limpiador del buscador, tambien se limpia borrando la palabra del input */
let limpiar=document.getElementById('limpiar');
limpiar.onclick=()=>{
        filtroProducto.value= "";
        productosHTML(productos);
}

/* Filtro para seleccionar las zapatillas de genero Hombre */
const filtroHombre = document.getElementById('hombre');
filtroHombre.addEventListener('click',function(e){
        e.preventDefault();
        const hombres = productos.filter(producto => producto.genero == 'Male')
        console.log(hombres);
        productosHTML(hombres);
})

/* Filtro para seleccionar las zapatillas del genero Mujer */
const filtroMujer = document.getElementById('mujer');
filtroMujer.addEventListener('click',function(e){
        e.preventDefault();
        const mujer = productos.filter(producto => producto.genero == 'Female')
        console.log(mujer);
        productosHTML(mujer);
})

/* Agrega el producto seleccionado al carrito */
function eventoBoton() {        
        let botones = document.getElementsByClassName('btnCompra'); 
        for (const boton of botones) {                
                boton.addEventListener('click', function () {   
                        /* Controlo si el producto ya existe en el carrito */                                    
                        let seleccion = carrito.find(productos => productos.id == this.id);
                        
                        if(seleccion){
                                seleccion.addCantidad();                                
                        }else{
                                seleccion= productos.find(producto => producto.id == this.id);
                                carrito.push(seleccion);
                        }
                        localStorage.setItem('Carrito', JSON.stringify(carrito));
                        carritoHTML(carrito);
                        Toastify({

                                text: `Se agrego ${seleccion.nombre} al carrito`,
                                
                                duration: 3000,
                                style: {
                                        background: "linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 35%, rgba(127,129,130,1) 100%)"
                                },
                                
                                }).showToast()
                        

                })
        }
        
}

/* Lista los elementos que contiene el carrito */

function carritoHTML(lista){
        cantidadCarrito.innerHTML = lista.length;
        productosCarrito.innerHTML = "";
        for (const producto of lista) {
                let prod = document.createElement('div');
                prod.innerHTML=`<p class='font'>${producto.nombre}</p>
                <p>Precio: ${producto.precio}</p>
                <p>Cantidad: ${producto.cantidad}</p>
                <p>Subtotal: ${producto.subTotal()}</p> 
                <a id="${producto.id}" class="btn  btn-ligth btn-add"><img src="multimedia/mas.png" height ="20" width="20" /></a>
                <a id="${producto.id}" class="btn  btn-ligth btn-sub "><img src="multimedia/menos.png" height ="20" width="20" /></a>
                <a id="${producto.id}" class="btn  btn-ligth btn-delete"><img src="multimedia/eliminar.png" height ="20" width="20" /></a>
                <hr>
                `
                productosCarrito.append(prod);
        }
        document.querySelectorAll('.btn-delete').forEach(boton => boton.onclick = eliminarCarrito);
        document.querySelectorAll('.btn-add').forEach(boton => boton.onclick = addCarrito);
        document.querySelectorAll('.btn-sub').forEach(boton => boton.onclick = subCarrito);
        totalCarrito();
        console.log('Esta es la lista')
        console.log(lista);
        
}

/* Funcion eliminar los productos del carrito */
function eliminarCarrito(e) {
        let posicion = carrito.findIndex(producto => producto.id == e.target.id);
        carrito.splice(posicion, 1);
        carritoHTML(carrito);
        localStorage.setItem('Carrito', JSON.stringify(carrito));
}

/* Funcion para agregar los productos al carrito */
function addCarrito() {
        let producto = carrito.find(p => p.id == this.id);
        producto.agregarCantidad(1);
        this.parentNode.children[2].innerHTML = "Cantidad: " + producto.cantidad;
        this.parentNode.children[3].innerHTML = "Subtotal: " + producto.subTotal();
        totalCarrito();
        localStorage.setItem('Carrito', JSON.stringify(carrito));
}

/* Funcion para el subtotal del carrito */
function subCarrito() {
        let producto = carrito.find(p => p.id == this.id);
        if (producto.cantidad > 1) {
                producto.agregarCantidad(-1);
                this.parentNode.children[2].innerHTML = "Cantidad: " + producto.cantidad;
                this.parentNode.children[3].innerHTML = "Subtotal: " + producto.subTotal();
                totalCarrito();
                localStorage.setItem('Carrito', JSON.stringify(carrito));
        }
}

/* Funcion para saber el total del carrito */
function totalCarrito() {
        let total = carrito.reduce((totalCompra, actual) => totalCompra += actual.subTotal(), 0);
        totalCarritoInterfaz.innerHTML = "TOTAL: USD$" + total;
        return total;
}

/* Promesa para verificar que el saldo del cliente pueda costear la compra */
function promesaCompra(saldo) {
        return new Promise(function (aceptado, rechazado) {
                if (saldo > 0) {
                        aceptado('Compra aceptada');

                } else {
                        rechazado('Compra rechazada');
                }
        })
}

/* Boton Confirmar del Carrito */
confirmar.onclick = () => {
        promesaCompra(saldoCliente).then((mensaje) => {

          /* Agrego un Snipper de manera que se muestre que esta cargando */
          productosCarrito.innerHTML = ` <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>`
          
          /* Agrego el metodo FETCH */
          fetch('https://apis.datos.gob.ar/georef/api/provincias')
            
            .then((respuesta) => {
              
              return respuesta.json()
         
            }).then((datos) => {
              console.log(datos);
             /* Interfaz de la seleccion de provincias */
              productosCarrito.innerHTML = `<h3 class="textDatos">Datos del Envio</h3>
                                            <p class="textoForm">Nombre:</p>
                                            <input class="inpPedidos" placeholder="Escribe tu nombre aquí.."></input>
                                            <p class="textoForm">Email:</p>
                                            <input class="inpPedidos"  placeholder="Escribe tu email aquí.."></input>
                                            <p class="textoForm">Destino:</p>
                                            <select id="provFiltro"></select> 
                                            <select id="munFiltro"></select>
                                            <p class="textoForm">Direccion:</p>
                                            <input class="inpPedidos" placeholder="Escribe tu direccion aquí.."></input>
                                            <p class="textoForm">Telefono:</p>
                                            <input type='number' class="inpPedidos" placeholder="Escribe tu telefono aquí.."></input>
                                            `;
              /* Obtenemos el select de la provincia */
              const provFiltro = document.getElementById('provFiltro');
              
              /* Recorre la info de la API y agrega al select */
              for (const provincia of datos.provincias) {
                provFiltro.innerHTML += `<option value="${provincia.id}">${provincia.nombre}</option>`;
              }
              
              /* Se asocia el evente change a la peticion de los municipios de la provincia seleccionada */
              provFiltro.onchange = () => {
                let idProvincia = provFiltro.value;
                let rutaBusqueda = `https://apis.datos.gob.ar/georef/api/municipios?provincia=${idProvincia}&campos=id,nombre&max=100`;
                fetch(rutaBusqueda)
                  .then(respuesta => respuesta.json())
                  .then(datos => {
                    console.log(datos);
                    let munFiltro = document.getElementById('munFiltro');
                    for (const municipio of datos.municipios) {
                      munFiltro.innerHTML += `<option value="${municipio.id}">${municipio.nombre}</option>`;
                    }

                    confirmar.onclick = () => {
                      console.log("ENVIAR A " + munFiltro.value + " EN  PROVINCIA ID " + idProvincia);
                      
                      fetch('https://jsonplaceholder.typicode.com/posts', {
                        method: 'POST',
                        body: JSON.stringify({
                          carrito: carrito, 
                          idProvincia: idProvincia,
                          idMunicipio: munFiltro.value
                        }),
                        headers: {
                          'Content-type': 'application/json; charset=UTF-8',
                        },
                        
                      }).then(respuesta => respuesta.json())
                        .then(data => {
                          Swal.fire({
                                icon: 'success',
                                title: 'Confirmado',
                                text: 'El pedido '+ data.id + ' ha sido procesado',
                                confirmButtonText: 'Aceptar',
                                confirmButtonColor: 'black',}

                          )
                        })
                    }
                  })
              }
            })
            
          
        }).catch((mensaje) => {
          alertaEstado(mensaje, "error")
        })
        localStorage.clear();
        carrito.splice(0,carrito.length);
        carritoHTML(carrito);
}
