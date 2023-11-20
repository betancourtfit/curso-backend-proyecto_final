export const generateUserError = (user) => {
    return `one or more properties were incomplete or not valid.
    List of required properties:
    * first_name : needs to be  a String, received ${user.first_name}
    * last_name : need to be a string, received ${user.last_name}
    * email: needs to be a strig, received ${user.email} 
    * age : needs to be a number, received ${user.age}`
}
export const generateProductError = (product) => {
    return `one or more properties were incomplete or not valid.
    List of required properties:
    * title : needs to be a String, received ${product.title}
    * description : needs to be a String, received ${product.description}
    * code : needs to be a string, received ${product.code}
    * price: needs to be a number, received ${product.price}
    * stock : needs to be a number, received ${product.stock}
    * category : needs to be a string, received ${product.category}`;
}
