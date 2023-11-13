# **Tercera entrega de tu Proyecto final**

## Mejorando la arquitectura del servidor

### Middleware de protección de rutas

✓ Las rutas Home, Categorias, Checkout y Cart estan protegidas por autenticacion y autorización a traves de PrivateRoute que evalua a partir de AuthConext que almacena si la sesion está iniciada o no y el rol del usuario. Todo se genera a partir del login

✓La Ruta Login al renderizar evaluar si existe una cookie válida de user y lo redirije al login

✓Todos los API endpoints estan protegidos por middleware autentificacion y autorización. En el caso de la home, chat, categorias, carrito y checkout exclusivos para usuarios. 

✓”Sólo el usuario puede agregar productos a su carrito”: La estrategia es que el endpoint ademas de la autenticacion y la autorización, añade los productos a partir de cart_id disponible en el token de la cookie. Por ende, si la cookie es modificada, no pasará la autenticación 

### Generación de Ticket de Orden a partir del carrito (”api/orders/checkout”)

✓Se crea una nueva collection llamada Order que posee:

- Monto de la compra
- Cantidad total de la compra
- Array de productos incluyendo de cada uno el id, code, price y title. No se usa Ref para evitar que posibles cambios de precio en los productos modifique las órdenes ya gener
- User_id Ref: Este atributo si se vincula vía ref para permitir que la información del usuario asociado sea dinámica y evitar duplicación de información almacenada.
- order_code: Es un código único de 6 digitos numéricos generado automáticamente de forma aleatoria en el OrderController y se valida contra MongoDB en caso de que se repita se genera uno nuevo.
- status: Se inicia automáticamente en “Pendiente de pago” a la espera de la confirmación dle pago
- address: dirección de entrega que viene del formulario del checkout
- created_at: dato en formato date_time que se genera al momento de la creación del documento de la orden en mongoose
- purchaser: mail del usuario comprador que se completa a partie del populare asociado el user_id ref

✓En la ruta de “/checkout” se renderiza el listado de items del carrito, con el monto total y se solicita la dirección de entrega + la confirmación de los TyC para habilitar el boton de creación de la orden

✓Cuando el usuario solicita la creación de la orden, se hace una evaluación producto por producto de la disponibilidad de stock en mongodb para completar la cantidad solicita, en caso de que no haya suficiente, lo deja en el carrito del usuario y en caso de que si haya disponibilidad hace la resta del stock en mongodb

✓Al finalizar exitosamente la creación de la orden se dan dos procesos:

- Se renderiza en pantalla un mensaje de Orden creada incluyendo el _id interno de mongodb del documento de la orden
- Se envía un mail de confirmación de pedido al usuario con nodemailer que incluye una lista de los productos confirmados, monto total y order_code

### Pendientes

- [ ]  Tengo un gap enorme en términos de gestión de errores principalmente en el backend, cada vez que se genera un error me cuesta muchísimo en primer lugar poder rastrear el punto exacto en el que se genera y en segundo lugar los detalles del mismo
- [ ]  Incluir las imágenes de productos