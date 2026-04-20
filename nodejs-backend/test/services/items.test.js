const assert = require("assert");
const app = require("../../src/app");

let usersRefData = [
  {
    name: "Standard User",
    email: "standard@example.com",
    password: "password",
  },
];

describe("items service", async () => {
  let thisService;
  let itemCreated;
  let usersServiceResults;
  let users;

  const customerDetailsCreated = await app
    .service("customerDetails")
    .Model.create({
      order: "parentObjectId",
      customerName: "new value",
      customerEmail: "new value",
      customerAddress: "new value",
      phoneNumber: "new value",
      gender: "new value",
      dateOfBirth: "2026-04-17T02:57:11.984Z",
    });
  const orderCreated = await app.service("order").Model.create({
    order: "parentObjectId",
    customerName: `${customerDetailsCreated._id}`,
    customerEmail: "new value",
    customerAddress: "new value",
    phoneNumber: "new value",
    gender: "new value",
    dateOfBirth: "2026-04-17T02:57:11.984Z",
    total: "new value",
  });
  const productPriceCreated = await app.service("productPrice").Model.create({
    order: `${orderCreated._id}`,
    customerName: `${customerDetailsCreated._id}`,
    customerEmail: "new value",
    customerAddress: "new value",
    phoneNumber: "new value",
    gender: "new value",
    dateOfBirth: "2026-04-17T02:57:11.984Z",
    total: "new value",
    product: "parentObjectId",
    productTitle: "new value",
    description: "new value",
    price: "parentObjectId",
    productName: "new value",
    basePrice: 23,
    currency: 23,
    discountedPrice: "new value",
    taxPercentage: "new value",
  });
  const productCreated = await app.service("product").Model.create({
    order: `${orderCreated._id}`,
    customerName: `${customerDetailsCreated._id}`,
    customerEmail: "new value",
    customerAddress: "new value",
    phoneNumber: "new value",
    gender: "new value",
    dateOfBirth: "2026-04-17T02:57:11.984Z",
    total: "new value",
    product: "parentObjectId",
    productTitle: "new value",
    description: "new value",
    price: `${productPriceCreated._id}`,
    productName: "new value",
    basePrice: 23,
    currency: 23,
    discountedPrice: "new value",
    taxPercentage: "new value",
    productImage: "new value",
    smallImage: "new value",
  });

  beforeEach(async () => {
    thisService = await app.service("items");

    // Create users here
    usersServiceResults = await app.service("users").Model.create(usersRefData);
    users = {
      createdBy: usersServiceResults[0]._id,
      updatedBy: usersServiceResults[0]._id,
    };
  });

  after(async () => {
    if (usersServiceResults) {
      await Promise.all(
        usersServiceResults.map((i) =>
          app.service("users").Model.findByIdAndDelete(i._id),
        ),
      );
    }
  });

  it("registered the service", () => {
    assert.ok(thisService, "Registered the service (items)");
  });

  describe("#create", () => {
    const options = {
      order: `${orderCreated._id}`,
      customerName: `${customerDetailsCreated._id}`,
      customerEmail: "new value",
      customerAddress: "new value",
      phoneNumber: "new value",
      gender: "new value",
      dateOfBirth: "2026-04-17T02:57:11.984Z",
      total: "new value",
      product: `${productCreated._id}`,
      productTitle: "new value",
      description: "new value",
      price: `${productPriceCreated._id}`,
      productName: "new value",
      basePrice: 23,
      currency: 23,
      discountedPrice: "new value",
      taxPercentage: "new value",
      productImage: "new value",
      smallImage: "new value",
      quantity: 23,
      productPrice: 23,
      amount: 23,
    };

    beforeEach(async () => {
      itemCreated = await thisService.Model.create({ ...options, ...users });
    });

    it("should create a new item", () => {
      assert.strictEqual(
        itemCreated.order.toString(),
        options.order.toString(),
      );
      assert.strictEqual(
        itemCreated.product.toString(),
        options.product.toString(),
      );
      assert.strictEqual(itemCreated.quantity, options.quantity);
      assert.strictEqual(itemCreated.productPrice, options.productPrice);
      assert.strictEqual(itemCreated.amount, options.amount);
    });
  });

  describe("#get", () => {
    it("should retrieve a item by ID", async () => {
      const retrieved = await thisService.Model.findById(itemCreated._id);
      assert.strictEqual(retrieved._id.toString(), itemCreated._id.toString());
    });
  });

  describe("#update", () => {
    const options = {
      order: `${orderCreated._id}`,
      product: `${productCreated._id}`,
      quantity: 100,
      productPrice: 100,
      amount: 100,
    };

    it("should update an existing item ", async () => {
      const itemUpdated = await thisService.Model.findByIdAndUpdate(
        itemCreated._id,
        options,
        { new: true }, // Ensure it returns the updated doc
      );
      assert.strictEqual(
        itemUpdated.order.toString(),
        options.order.toString(),
      );
      assert.strictEqual(
        itemUpdated.product.toString(),
        options.product.toString(),
      );
      assert.strictEqual(itemUpdated.quantity, options.quantity);
      assert.strictEqual(itemUpdated.productPrice, options.productPrice);
      assert.strictEqual(itemUpdated.amount, options.amount);
    });
  });

  describe("#delete", async () => {
    it("should delete a item", async () => {
      await app
        .service("users")
        .Model.findByIdAndDelete(usersServiceResults._id);

      await app
        .service("customerDetails")
        .Model.findByIdAndDelete(customerDetailsCreated._id);
      await app.service("order").Model.findByIdAndDelete(orderCreated._id);
      await app
        .service("productPrice")
        .Model.findByIdAndDelete(productPriceCreated._id);
      await app.service("product").Model.findByIdAndDelete(productCreated._id);

      const itemDeleted = await thisService.Model.findByIdAndDelete(
        itemCreated._id,
      );
      assert.strictEqual(
        itemDeleted._id.toString(),
        itemCreated._id.toString(),
      );
    });
  });
});
