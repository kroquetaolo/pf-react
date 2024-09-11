import { expect } from 'chai'
import supertest from 'supertest'
import config from '../src/config/config.js'

import { faker } from "@faker-js/faker";

const requester = supertest('http://localhost:8080')

describe('testing shopfruit', function () {

    let admin_token, user_token, user_cart_id, first_product_id;

    describe('Testing de la API de session', function () {
        describe('Login correcto del usuario', function () {
            it('loggeando como admin', async function () {
                const email = config.adminUsername
                const password = config.adminPassword
                const response = await requester.post('/api/sessions/login')
                    .send({ email , password});
    
                const cookies = response.headers['set-cookie'];
                const token_cookie = cookies.find(cookie => cookie.startsWith('token='));
                expect(token_cookie).to.be.ok
                admin_token = token_cookie.split(';')[0].split('=')[1]
    
            })
            
        })
    
        describe('Regist correcto de un nuevo usuario', function () {
            const moke_user = {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                age: faker.date.birthdate(),
                password: faker.internet.password(),
            }
            it('Registrando y aplicando token del usuario nuevo', async function () {
                const response = await requester.post('/api/sessions/register')
                    .send(moke_user);
                
                const cookies = response.headers['set-cookie'];
                const token_cookie = cookies.find(cookie => cookie.startsWith('token='));
                expect(token_cookie).to.be.ok
                user_token = token_cookie.split(';')[0].split('=')[1]
                
            })
            
            it('Comprobando current del usuario nuevo', async function () {
                const response = await requester.get('/api/sessions/current')
                    .set('Cookie', `token=${user_token}`)
                expect(response._body).to.have.property('payload')
                const payload = response._body.payload

                expect(payload).to.have.property('user')
                user_cart_id = payload.user.cart
            })
        })

    })

    describe('Testing de la API de products', function () {
        let product_id
        const mock_product = {
            title: 'Iphone 11',
            description: 'tremendo iphone 11',
            price: 990,
            stock: 20,
        }

        it('Revisión de productos en GET /api/products', async function () {
            const result = await requester.get('/api/products')
            const payload = result._body.payload
            expect(payload).to.have.property('payload')
            expect(payload.payload[0]).to.have.property('_id')
            first_product_id = payload.payload[0]._id
        })

        it('Creación de productos POST /api/products', async function () {

            const { body } = await requester.post('/api/products')
                .set('Cookie', `token=${admin_token}`)
                .field('title', mock_product.title)
                .field('description', mock_product.description)
                .field('price', mock_product.price)
                .field('stock', mock_product.stock)
                .field('type', 'product')
                .field('category', 'electronics')
                .attach('uploaded_file', './test/iphone11.jpg')

                expect(body).to.be.ok
                expect(body).to.have.property('payload')
                expect(body.payload).to.have.property('_id')
                product_id = body.payload._id
        })

        it('Verificar si el producto se creo con un ID autogenerado y el titulo definido en el MOCK', async function () {
            const { _body } = await requester.get('/api/products/'+product_id)

            expect(_body.payload).to.have.property('_id')
            expect(_body.payload).to.have.property('title', mock_product.title)

        })
        it('Verificar si el producto se elimina de la base de datos', async function () {
            const { body } = await requester.delete('/api/products/'+product_id)
                .set('Cookie', `token=${admin_token}`)
            
            expect(body).to.have.property('payload')
            expect(body.payload.acknowledged).to.be.true
            expect(body.payload).to.have.property('deletedCount', 1)
            
        })
        
        it('Verifivar que el producto ya no existe', async function () {
            const { _body } = await requester.get('/api/products/'+product_id)
            expect(_body.payload).to.be.null

        })
    })

    describe('Testing de la API de cart (ADMIN)', async function () {
        let first_cart_id
        it('Revisión de GET para /api/carts', async function () {
            const result = await requester.get('/api/carts')
                .set('Cookie', `token=${admin_token}`)
            const payload = result._body.payload
            expect(payload).not.to.be.undefined
            first_cart_id =  payload[0]._id
            
        })
        
        it('Revisión de GET para /api/carts/:cid', async function () {
            const result = await requester.get('/api/carts/'+first_cart_id)
                .set('Cookie', `token=${admin_token}`)
            const payload = result._body.payload
            expect(payload).not.to.be.undefined
            expect(payload).to.have.property('_id', first_cart_id)
        })
    })

    
    describe('Testing de la API de cart (USER)', function () {
        it('Verificar que no puede acceder a todos los carritos', async function () {
            const result = await requester.get('/api/carts')
                .set('Cookie', `token=${user_token}`)
            expect(result).not.to.have.property('_body')

        })
        it('Verificar que el usuario puede agregar un producto a su carrito', async function () {
            const result = await requester.put(`/api/carts/${user_cart_id}/products/${first_product_id}`)
                .set('Cookie', `token=${user_token}`)
            
            const payload = result._body.payload
            const updated_cart = payload.updated_cart

            expect(payload).to.have.property('update_result')
            expect(payload).to.have.property('updated_cart')
            expect(updated_cart.products[0]).to.have.property('product_id', first_product_id)
            
        })
        it('Verificar que el usuario puede borrar un producto a su carrito', async function () {
            const result = await requester.delete(`/api/carts/${user_cart_id}/products/${first_product_id}`)
                .set('Cookie', `token=${user_token}`)
            const payload = result._body.payload

            const updated_cart = payload.updated_cart

            expect(payload).to.have.property('delete_result')
            expect(payload).to.have.property('updated_cart')
            expect(updated_cart).to.be.an('array').that.is.empty;
            
        })
    })
})
