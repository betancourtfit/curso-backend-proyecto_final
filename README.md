# **Módulos de testing para proyecto final**
### Premisas
- [x]Se implementó el script usersupertest que hace testing de las siguientes funciones:
    1. ruta api/users metodo post
    2. solicitar datos de usuarios mediante GET en /users/email/:email
    3. actualizar usuario mediante PUT en /users/:id
    4. iniciar sesion con post a traves de /sessions/login.
    5. consultar datos de usuario a traves de GET en sessions/current
    6. eliminar usuario mediante DELETE en /users/:id

- [x]Se implementó el script productssupertest que hace testing de las siguientes funciones:
    1. iniciar sesion con post a traves de /sessions/login
    2.crear un producto mediante post
    3. actualizar producto mediante PUT en /products/:id
    4. obtener un producto por id
    5.Eliminar el producto creado con DELETE en /products/:id

- [x]Se implementó el script cartssupertest que hace testing de las siguientes funciones:
    1. crear un cart mediante post
    2. agregar un producto a un cart mediante PUT en /carts/:cid/products/:pid
    3. eliminar cart mediante DELETE en /carts/:id

# **Documentar API**

✓ Se implementó Swagger para disonibilizar en el endpoint http://localhost:4000/apidocs/#/ la documentación de las rutas de API Carts, Users, Products y Sessions

# **Práctica de integración sobre tu ecommerce**

### Sistema de recuperación
✓ El usuario ahora cuenta en el login con un link para ir al recupero de contraseña, ingresando su mail
✓ El link de recuperacion llega via mail que incluye el token que dura 1 hora y funciona con jwt. tiene una codificacion y decodificacion de los puntos que separan los componentes para evitar que genere conflicto con la ruta URL
✓ Al clickear lleva al usuario a la pagina de recuperacion que toma la contraseña y la confirmacion, al hacer clic e enviar valida que sean iguales y envia al backend que en caso de token valido devuelve una notificacion que redirige al login pero si el token esta expirado muestra un modal indicativo y redirige a solicitar nuevamente el link

### Sistema de usuarios premium
✓ Ahora el rol de usuario contempla la opcion premium, que puede ser modificado entre user y premium con un PUT al endpoint http://localhost:4000/api/users/premium/:email
✓ El usuario premium al momento de crear la orden, se le aplica un 10% de descuento que se ve reflejado en el mail de confirmacion. Se conservan el monto original, descuento y montofinal para fines de poder dar visibilidad y trazabiliad



# **Entrega Mocking y manejo de errores**

### Mocking con faker para creacion de productos


✓ El endpoint POST 'api/products/mockingproducts' genera un producto nuevo con faker

✓El endpoint POST 'api/products/mockingproducts/:number' genera una cantidad n de productos segun number

✓Los endpoints de POST y PUT estan restringidos a perfiles con rol:admin por lo cual se debe acceder con email: beta.juanc@gmail.com y password: 123456 y la autenticacion es con jwtCookie


### CUSTOM ERRORS

✓Fueron añadidos custom errors para

- producto no encontrado
- Carrito no encontrado
- Campos faltante en la creacion de producto o de usuario
- Errores de conexion con mongodb
- Productos con stock insuficiente cuando se genera la orden (incluye un log con persistencia local)

✓Para testear los custom error de campo faltante en product o user creation se pueden usar POST en '/api/products/' o '/api/users/signup' excluyendo alguno de los campos obligatorios, dejo ejemplos:
User
{
    "first_name": "lalo",
    "last_name": "landa",
    "age": 35
    "email": "lalolanda20@noreply.con",
    "password": "123456"
}
Product
{
    "title": "Goose Island Lager",
    "description": "473ml",
    "code": "abc9",
    "price": 399,
    "stock": 10,
    "category": "Destilados"
}

✓Para testear Stock Faltante habilite desde el frontend añadir más productos al carrito de lo disponible en stock, el producto "Genérico Granito Guantes" o "Cereveza 27 easy" tiene un stock asignado de 2 unidades asi que si se arma una orden con mas cantidad, al momento de la generacion de la orden lo va a dejar en el cart y generasr en consola y en stockErrors.log  va a dejar detalle del faltante mientras avanza con la oden y envia confirmacion por mail.


### Uso de nodemailer
✓La ordenes cuando se confirman se genera un mail de confirmacion de la orden que incluye detalle de productos y monto
✓En el registro de usuarios, se incluyó una validación de mail, se debe ingresar el codigo enviado por mail al usuario para habilitar el proceso de compra