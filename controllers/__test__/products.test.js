const app = require('../../app');
const request = require('supertest');

const phoneProduct = {
  name: 'Phone',
  description: 'Phone description',
  price: 123.45,
  deliveryPrice: 12.34,
};

const tableProduct = {
  name: 'Table',
  description: 'Table description',
  price: 333.56,
  deliveryPrice: 50.12,
};

const penProduct = {
  name: 'Pen',
  description: 'Pen description',
  price: 10.34,
  deliveryPrice: 8.1,
};

const sampleProduct = {
  name: 'Product name',
  description: 'Product description',
  price: 123.45,
  deliveryPrice: 12.34,
};

const headers = {
  k: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ3ZTE0OTlkLTNmNWYtNGMxNC04ZjY1LTBjZjBkNTJhMWYzYSIsIm5hbWUiOiJKb2huIERvZSIsImVtYWlsIjoiam9obi5kb2VAZW1haWwuY29tIn0.SJUucdpb_06OTJdxSstmBrACFOubju7mXcaJyGZmVtM',
};

test('Retrieves all products (limit by default is to return 5 products)', async (done) => {
  await request(app)
    .post('/products')
    .set(headers)
    .send(phoneProduct)
    .expect(201);

  await request(app)
    .post('/products')
    .set(headers)
    .send(phoneProduct)
    .expect(201);

  await request(app)
    .post('/products')
    .set(headers)
    .send(tableProduct)
    .expect(201);

  await request(app)
    .post('/products')
    .set(headers)
    .send(tableProduct)
    .expect(201);

  await request(app)
    .post('/products')
    .set(headers)
    .send(penProduct)
    .expect(201);

  await request(app)
    .post('/products')
    .set(headers)
    .send(penProduct)
    .expect(201);

  const response = await request(app)
    .get('/products')
    .set(headers)
    .send()
    .expect(200);

  expect(response.body.success).toBeTruthy();
  expect(response.body.data.items.length).toBe(5);

  done();
}, 5000);

test('Retrieves all products limiting number of products returned', async () => {
  await request(app)
    .post('/products')
    .set(headers)
    .send(phoneProduct)
    .expect(201);

  await request(app)
    .post('/products')
    .set(headers)
    .send(phoneProduct)
    .expect(201);

  await request(app)
    .post('/products')
    .set(headers)
    .send(tableProduct)
    .expect(201);

  await request(app)
    .post('/products')
    .set(headers)
    .send(tableProduct)
    .expect(201);

  await request(app)
    .post('/products')
    .set(headers)
    .send(penProduct)
    .expect(201);

  await request(app)
    .post('/products')
    .set(headers)
    .send(penProduct)
    .expect(201);

  const response = await request(app)
    .get('/products?limit=3')
    .set(headers)
    .send()
    .expect(200);

  expect(response.body.success).toBeTruthy();
  expect(response.body.data.items.length).toBe(3);
});

test('Retrieves all products limiting number of products returned and implementing pagination', async () => {
  await request(app)
    .post('/products')
    .set(headers)
    .send(phoneProduct)
    .expect(201);

  await request(app)
    .post('/products')
    .set(headers)
    .send(phoneProduct)
    .expect(201);

  await request(app)
    .post('/products')
    .set(headers)
    .send(tableProduct)
    .expect(201);

  await request(app)
    .post('/products')
    .set(headers)
    .send(tableProduct)
    .expect(201);

  await request(app)
    .post('/products')
    .set(headers)
    .send(penProduct)
    .expect(201);

  await request(app)
    .post('/products')
    .set(headers)
    .send(penProduct)
    .expect(201);

  const response = await request(app)
    .get('/products?limit=3&page=1')
    .set(headers)
    .send()
    .expect(200);

  expect(response.body.success).toBeTruthy();
  expect(response.body.data.items.length).toBe(3);
  expect(
    response.body.data.items[response.body.data.items.length - 1].name
  ).toBe('Table');
});

test('Retrieves a product matching a product id with invalid uuid', async () => {
  await request(app)
    .get('/products/01234567-89ab-cdef-013t-456789abcdef')
    .set(headers)
    .send()
    .expect(400);
});

test('Retrieves all products matching a name parameter', async () => {
  await request(app)
    .post('/products')
    .set(headers)
    .send(phoneProduct)
    .expect(201);

  await request(app)
    .post('/products')
    .set(headers)
    .send(tableProduct)
    .expect(201);

  await request(app)
    .post('/products')
    .set(headers)
    .send(penProduct)
    .expect(201);

  const productSearch = 'Phone';
  const response = await request(app)
    .get(`/products?name=${productSearch}`)
    .set(headers)
    .send()
    .expect(200);

  expect(response.body.success).toBeTruthy();
  expect(response.body.data.items.length).toBe(1);
});

test('Retrieves a product matching a product Id', async () => {
  const phoneResponse = await request(app)
    .post('/products')
    .set(headers)
    .send(phoneProduct)
    .expect(201);

  const response = await request(app)
    .get(`/products/${phoneResponse.body.data.id}`)
    .set(headers)
    .send()
    .expect(200);

  expect(response.body.success).toBeTruthy();
  expect(response.body.data).toBeTruthy();
  expect(response.body.data.id).toBe(phoneResponse.body.data.id);
});

test('Create a new product', async () => {
  const response = await request(app)
    .post('/products')
    .set(headers)
    .send(sampleProduct)
    .expect(201);

  expect(response.body.success).toBeTruthy();
  expect(response.body.data).toBeTruthy();
});

test('Updates a product matching a product Id', async () => {
  const response = await request(app)
    .post('/products')
    .set(headers)
    .send(sampleProduct)
    .expect(201);

  expect(response.body.success).toBeTruthy();

  const updatedProductResponse = await request(app)
    .put(`/products/${response.body.data.id}`)
    .set(headers)
    .send({
      name: 'Updated product name',
      description: 'Updated product description',
      price: 567.89,
      deliveryPrice: 45.9,
    })
    .expect(200);

  expect(updatedProductResponse.body.success).toBeTruthy();
});

test('Deletes a product matching a product Id', async () => {
  const response = await request(app)
    .post('/products')
    .set(headers)
    .send(sampleProduct)
    .expect(201);

  expect(response.body.success).toBeTruthy();

  await request(app)
    .post(`/products/${response.body.data.id}/options`)
    .set(headers)
    .send({
      name: 'Product option',
      description: 'Product option description',
    })
    .expect(201);

  await request(app)
    .delete(`/products/${response.body.data.id}`)
    .set(headers)
    .send()
    .expect(204);
});

test('Retrieves all product options matching a product Id', async () => {
  let productResponse = await request(app)
    .post('/products')
    .set(headers)
    .send(phoneProduct)
    .expect(201);

  expect(productResponse.body.success).toBeTruthy();

  const productOptionResponse = await request(app)
    .post(`/products/${productResponse.body.data.id}/options`)
    .set(headers)
    .send({
      name: 'Product option',
      description: 'Product option description',
    })
    .expect(201);

  expect(productOptionResponse.body.success).toBeTruthy();
  expect(productOptionResponse.body.data).toBeTruthy();

  productResponse = await request(app)
    .get(`/products/${productResponse.body.data.id}`)
    .set(headers)
    .send()
    .expect(200);

  expect(productResponse.body.data.productOptions.length).toBe(1);
});

test('Retrieves a product option matching an product option id and product id', async () => {
  const productResponse = await request(app)
    .post('/products')
    .set(headers)
    .send(phoneProduct)
    .expect(201);

  const productOptionResponse = await request(app)
    .post(`/products/${productResponse.body.data.id}/options`)
    .set(headers)
    .send({
      name: 'Product option',
      description: 'Product option description',
    })
    .expect(201);

  const response = await request(app)
    .get(
      `/products/${productResponse.body.data.id}/options/${productOptionResponse.body.data.id}`
    )
    .set(headers)
    .send()
    .expect(200);

  expect(response.body.success).toBeTruthy();
});

test('Creates a product option for a product with matching product id', async () => {
  const productResponse = await request(app)
    .post('/products')
    .set(headers)
    .send(phoneProduct)
    .expect(201);
  expect(productResponse.body.success).toBeTruthy();

  const productOptionResponse = await request(app)
    .post(`/products/${productResponse.body.data.id}/options`)
    .set(headers)
    .send({
      name: 'Product option',
      description: 'Product option description',
    })
    .expect(201);

  expect(productOptionResponse.body.success).toBeTruthy();
  expect(productOptionResponse.body.data).toBeTruthy();
  expect(productOptionResponse.body.data.product).toBe(
    productResponse.body.data.id
  );

  const response = await request(app)
    .get(`/products/${productResponse.body.data.id}`)
    .set(headers)
    .send();

  expect(response.body.data.productOptions.length).toBe(1);
});

test('Updates an existing product option matching a product id', async () => {
  const productResponse = await request(app)
    .post('/products')
    .set(headers)
    .send(phoneProduct)
    .expect(201);

  const productOptionResponse = await request(app)
    .post(`/products/${productResponse.body.data.id}/options`)
    .set(headers)
    .send({
      name: 'Product option',
      description: 'Product option description',
    })
    .expect(201);

  await request(app)
    .put(
      `/products/${productResponse.body.data.id}/options/${productOptionResponse.body.data.id}`
    )
    .set(headers)
    .send({
      name: 'Updated product name',
      description: 'Updated product description',
    })
    .expect(200);

  const updatedProductOptionResponse = await request(app)
    .get(
      `/products/${productResponse.body.data.id}/options/${productOptionResponse.body.data.id}`
    )
    .set(headers)
    .send()
    .expect(200);

  expect(updatedProductOptionResponse.body.success).toBeTruthy();
  expect(updatedProductOptionResponse.body.data.name).toBe(
    'Updated product name'
  );
  expect(updatedProductOptionResponse.body.data.description).toBe(
    'Updated product description'
  );
});

test('Delete a product option matching a product id and product option id', async () => {
  const productResponse = await request(app)
    .post('/products')
    .set(headers)
    .send(phoneProduct)
    .expect(201);

  const productOptionResponse = await request(app)
    .post(`/products/${productResponse.body.data.id}/options`)
    .set(headers)
    .send({
      name: 'Product option 1',
      description: 'Product option description 1',
    })
    .expect(201);

  await request(app)
    .post(`/products/${productResponse.body.data.id}/options`)
    .set(headers)
    .send({
      name: 'Product option 2',
      description: 'Product option description 2',
    })
    .expect(201);

  await request(app)
    .delete(
      `/products/${productResponse.body.data.id}/options/${productOptionResponse.body.data.id}`
    )
    .set(headers)
    .send()
    .expect(204);

  const response = await request(app)
    .get(`/products/${productResponse.body.data.id}`)
    .set(headers)
    .send()
    .expect(200);

  expect(response.body.data.productOptions.length).toBe(1);
});
