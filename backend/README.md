## Módulos de testing para proyecto final
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
    
## DESAFIO - Implementación de logger
### Premisas
- [x]Se implemento logger en la funcion de createProduct con la ruta '/api/products/', si se intenta enviar con postman la creacion de un producto con un parametro faltante, code duplicado, se genera un registro en el log. Dejo una estructura completa de un producto ya creado. 
{
    "title": "Goose Island Lager",
    "description": "473ml",
    "code": "abc9",
    "price": 399,
    "stock": 10,
    "category": "Destilados"
}
Para acceder a un toke con rol de admi se puede usar el endpoint '/api/sessions/login' con este body de credenciales
{
    "email": "juana@gmail.com",
    "password":"123456"
}

## DESAFIO - INTEGRACION SOBRE ECOMMERCE
### Premisas
- [x]  Crear un modelo User el cual contará
con los campos:
    - first_name:String,
    - last_name:String,
    - email:String (único)
    - age:Number,
    - password:String(Hash)
    - cart:Id con referencia a Carts
    - role:String(default:’user’)
- [x]  Desarrollar las estrategias de Passport
para que funcionen con este modelo de
usuarios
- [x]  Modificar el sistema de login del usuario
para poder trabajar con session o con
jwt (a tu elección).
- [x]  (Sólo para jwt) desarrollar una
estrategia “current” para extraer la
cookie que contiene el token para
obtener el usuario asociado a dicho
token, en caso de tener el token,
devolver al usuario asociado al token,
caso contrario devolver un error de
passport, utilizar un extractor de cookie
- [x]  Agregar al router /api/sessions/ la ruta
/current, la cual utilizará el modelo de
sesión que estés utilizando, para poder
devolver en una respuesta el usuario
actual.
### Comentarios
- Desde la ruta /login tanto para estrategia local como github, el inicio de sesion exitoso deriva en la home con un mensaje de bienvenida que se muestra una única vez por cada login
- En el navbar se puede visualizar en todo momento el nombre del usuario
- Las principales vistas y rutas estan ya integradas con middleware de autenticacion y autorizacion por roles
- El usuario por default juana@gmail.com password: 123456 es 'admin' por lo cual puede acceder a todas las vistas, incluyendo /realTimeProducts, las API de POST, PUT y DELETE tambien poseen middleware de autorización solo para sol 'admin'
- Para testear el rol 'user' puede usar el email juanita@gmail.com password: 123456, puede acceder a la home y el chat pero no a /RealTimeProducts
- El chat ahora no solicta el email ya que lo toma directo de la cookie UserData
- Para que el mensaje de bienvenida se muestre una unica vez por login, se añadio el atributo welcome:true en la cookie UserData que al momento de ser renderizado el mensaje, hace un post a la ruta api/sessions/update-welcome que reemplaza la cookie con el valor welcome=false