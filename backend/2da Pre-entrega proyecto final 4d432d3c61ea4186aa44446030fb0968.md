# 2da Pre-entrega proyecto final

Date Created: September 9, 2023 8:47 PM

1. API PRODUCTS
    - [x]  LIMIT: permitirá devolver sólo el
    número de elementos
    solicitados al momento de la
    petición, en caso de no recibir
    limit, éste será de 10.
    - [x]  PAGE: permitirá devolver la
    página que queremos buscar,
    en caso de no recibir page,
    ésta será de 1
    - [x]  QUERY: el tipo de elemento que
    quiero buscar (es decir, qué
    filtro aplicar), en caso de no
    recibir query, realizar la
    búsqueda general
    - [x]  SORT: asc/desc, para realizar
    ordenamiento ascendente o
    descendente por precio, en
    caso de no recibir sort, no
    realizar ningún ordenamiento
    - [x]  Formato GET:
    - formato
        
        status:success/error
        payload: Resultado de los productos solicitados
        totalPages: Total de páginas
        prevPage: Página anterior
        nextPage: Página siguiente
        page: Página actual
        hasPrevPage: Indicador para saber si la página
        previa existe
        hasNextPage: Indicador para saber si la página
        siguiente existe.
        prevLink: Link directo a la página previa (null si
        hasPrevPage=false)
        nextLink: Link directo a la página siguiente (null si
        hasNextPage=false)
        
2. API CARTS
    - [x]  DELETE api/carts/:cid/products/:pid
    deberá eliminar del carrito el
    producto seleccionado.
    - [x]  PUT api/carts/:cid deberá actualizar
    el carrito con un arreglo de
    productos con el formato
    especificado arriba
    - [x]  PUT api/carts/:cid/products/:pid
    deberá poder actualizar SÓLO la
    cantidad de ejemplares del producto
    por cualquier cantidad pasada
    desde req.body
    - [x]  DELETE api/carts/:cid deberá
    eliminar todos los productos del
    carrito
    - [x]  POPULATE: Esta vez, para el modelo de Carts,
    en su propiedad products, el id
    de cada producto generado
    dentro del array tiene que hacer
    referencia al modelo de Products.
    Modificar la ruta /:cid para que al
    traer todos los productos, los
    traiga completos mediante un
    “populate”. De esta manera
    almacenamos sólo el Id, pero al
    solicitarlo podemos desglosar los
    productos asociados.
3. VISTAS
    - [x]  Además, agregar una vista en ‘/carts/:cid (cartId) para
    visualizar un carrito específico, donde se deberán
    listar SOLO los productos que pertenezcan a dicho
    carrito.
    - [ ]  Crear una vista en el router de views ‘/products’ para
    visualizar todos los productos con su respectiva
    paginación. Contar con el botón de “agregar al carrito”
    directamente, sin necesidad de abrir una
    página adicional con los detalles del producto