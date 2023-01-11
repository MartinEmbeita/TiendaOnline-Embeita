fetch("productos.json")
  .then(response => response.json())
  .then(productos => miPrograma(productos))

function miPrograma(productos) {

  let contenedorCarrito = document.getElementById("contenedorCarrito")

  let contenedor = document.getElementById("contenedorProductos")
  renderizarProductos(productos)

  let carrito = []
  if (localStorage.getItem("carrito")) {
    carrito = JSON.parse(localStorage.getItem("carrito"))
  }
  renderizarCarrito(carrito)

  let buscador = document.getElementById("buscador")
  buscador.addEventListener("input", renderizarProductosFiltrados)

  function renderizarProductosFiltrados(e) {
    let productosFiltrados = productos.filter(producto => producto.nombre.toLowerCase().includes(buscador.value.toLowerCase()) || producto.categorias.find(categoria => categoria.includes(buscador.value.toLowerCase())))
    renderizarProductos(productosFiltrados)
  }

  function renderizarProductos(arrayDeProductos) {
    contenedor.innerHTML = ""
    for (const producto of arrayDeProductos) {
      let tarjetaProducto = document.createElement("div")
      tarjetaProducto.className = "producto"
      tarjetaProducto.id = producto.id
    
      tarjetaProducto.innerHTML = `
        <img src=${producto.imgUrl} class="imagenProducto"> <br>
        <h3 id="nombreProducto">${producto.nombre}</h3>
        <p>Stock: ${producto.stock}</p>
        <p>Precio: $${producto.precio}</p>
        <button class="boton" id=${producto.id}>Añadir al carrito</button>
      `
      contenedor.appendChild(tarjetaProducto)
    }
    let botones = document.getElementsByClassName("boton")
    for (const boton of botones) {
      boton.addEventListener("click", agregarAlCarrito)
    }
  }

  function agregarAlCarrito(e) {
    let productoBuscado = productos.find(producto => producto.id == e.target.id)
    let posicionDelProductoBuscado = carrito.findIndex(producto => producto.id == productoBuscado.id)
    if (posicionDelProductoBuscado != -1) {
      carrito[posicionDelProductoBuscado].unidades++
      carrito[posicionDelProductoBuscado].subtotal = carrito[posicionDelProductoBuscado].unidades * carrito[posicionDelProductoBuscado].precioUnitario
    } else {
      carrito.push({id: productoBuscado.id, nombre: productoBuscado.nombre, precioUnitario: productoBuscado.precio, unidades: 1, subtotal: productoBuscado.precio})
      localStorage.setItem("carrito", JSON.stringify(carrito))
    }
    // alert(`Has agregado ${productoBuscado.nombre} al carrito por $${productoBuscado.precio}`);

    renderizarCarrito(carrito)
  }

  function renderizarCarrito(arrayDeProductos) {
    contenedorCarrito.innerHTML = ''
    for (const producto of arrayDeProductos) {
      contenedorCarrito.innerHTML += `
        <div class="flex">
          <h3>Compraste: ${producto.nombre} (${producto.unidades}.u) por $${producto.precioUnitario}</h3>
        </div>
      `
    }

    let total = carrito.reduce((acc, valorActual) => acc + valorActual.subtotal, 0)
    contenedorCarrito.innerHTML += `
      <h3>TOTAL $${total}</h3>
    `
  }

  let botonComprar = document.getElementById("comprar")
  botonComprar.addEventListener("click", () => {
    Swal.fire({
      icon: 'success',
      title: 'Gracias por su compra',
      showConfirmButton: false,
      timer: 1500
    })
    localStorage.removeItem("carrito")
    carrito = []
    renderizarCarrito(carrito)
  })

}