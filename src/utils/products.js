import { faker } from "@faker-js/faker";

export function generateProducts() {
    return {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        thumbnail: faker.image.url(),
        category: faker.commerce.department(),
        price: faker.commerce.price(),

    }
}