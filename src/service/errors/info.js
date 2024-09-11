const generateError = (object, required) => {
    const missingFields = required.filter(field => !object[field]);
    return `Required parameters: ${missingFields.join(', ')}`;
}

export const generateUserError = (user) => {
    const required = ['first_name', 'last_name', 'email', 'age', 'password'];
    return generateError(user, required);
}

export const generateProductsError = (product) => {
    const required = ['title', 'description', 'price', 'stock', 'category'];
    return generateError(product, required);
}