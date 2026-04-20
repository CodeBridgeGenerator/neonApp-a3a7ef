const assert = require("assert");
const app = require("../../src/app");

let usersRefData = [
  {
    name: "Standard User",
    email: "standard@example.com",
    password: "password",
  },
];

describe("cartItem service", async () => {
  let thisService;
  let cartItemCreated;
  let usersServiceResults;
  let users;

  const productPriceCreated = await app.service("productPrice").Model.create({
    productName: "new value",
    productTitle: "new value",
    description: "new value",
    price: "parentObjectId",
    basePrice: 23,
    currency: 23,
    discountedPrice: "new value",
    taxPercentage: "new value",
  });
  const productCreated = await app.service("product").Model.create({
    productName: "new value",
    productTitle: "new value",
    description: "new value",
    price: `${productPriceCreated._id}`,
    basePrice: 23,
    currency: 23,
    discountedPrice: "new value",
    taxPercentage: "new value",
    productImage: "new value",
    smallImage: "new value",
  });
  const productColorCreated = await app.service("productColor").Model.create({
    productName: "new value",
    productTitle: "new value",
    description: "new value",
    price: `${productPriceCreated._id}`,
    basePrice: 23,
    currency: 23,
    discountedPrice: "new value",
    taxPercentage: "new value",
    productImage: "new value",
    smallImage: "new value",
    colour: "parentObjectId",
    colorName: "new value",
    colorCode: "new value",
    colorImage: "new value",
    defaultColor: "new value",
  });
  const productSizeCreated = await app.service("productSize").Model.create({
    productName: "new value",
    productTitle: "new value",
    description: "new value",
    price: `${productPriceCreated._id}`,
    basePrice: 23,
    currency: 23,
    discountedPrice: "new value",
    taxPercentage: "new value",
    productImage: "new value",
    smallImage: "new value",
    colour: `${productColorCreated._id}`,
    colorName: "new value",
    colorCode: "new value",
    colorImage: "new value",
    defaultColor: "new value",
    size: "parentObjectId",
    sizeCategory: "new value",
    sizeValue: "new value",
    stockQuantity: 23,
    availableSize: "new value",
  });

  beforeEach(async () => {
    thisService = await app.service("cartItem");

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
    assert.ok(thisService, "Registered the service (cartItem)");
  });

  describe("#create", () => {
    const options = {
      productName: "new value",
      productTitle: "new value",
      description: "new value",
      price: `${productPriceCreated._id}`,
      basePrice: 23,
      currency: 23,
      discountedPrice: "new value",
      taxPercentage: "new value",
      productImage: "new value",
      smallImage: "new value",
      colour: `${productColorCreated._id}`,
      colorName: "new value",
      colorCode: "new value",
      colorImage: "new value",
      defaultColor: "new value",
      size: `${productSizeCreated._id}`,
      sizeCategory: "new value",
      sizeValue: "new value",
      stockQuantity: 23,
      availableSize: "new value",
    };

    beforeEach(async () => {
      cartItemCreated = await thisService.Model.create({
        ...options,
        ...users,
      });
    });

    it("should create a new cartItem", () => {
      assert.strictEqual(
        cartItemCreated.productName.toString(),
        options.productName.toString(),
      );
      assert.strictEqual(
        cartItemCreated.colour.toString(),
        options.colour.toString(),
      );
      assert.strictEqual(
        cartItemCreated.size.toString(),
        options.size.toString(),
      );
    });
  });

  describe("#get", () => {
    it("should retrieve a cartItem by ID", async () => {
      const retrieved = await thisService.Model.findById(cartItemCreated._id);
      assert.strictEqual(
        retrieved._id.toString(),
        cartItemCreated._id.toString(),
      );
    });
  });

  describe("#update", () => {
    const options = {
      productName: `${productCreated._id}`,
      colour: `${productColorCreated._id}`,
      size: `${productSizeCreated._id}`,
    };

    it("should update an existing cartItem ", async () => {
      const cartItemUpdated = await thisService.Model.findByIdAndUpdate(
        cartItemCreated._id,
        options,
        { new: true }, // Ensure it returns the updated doc
      );
      assert.strictEqual(
        cartItemUpdated.productName.toString(),
        options.productName.toString(),
      );
      assert.strictEqual(
        cartItemUpdated.colour.toString(),
        options.colour.toString(),
      );
      assert.strictEqual(
        cartItemUpdated.size.toString(),
        options.size.toString(),
      );
    });
  });

  describe("#delete", async () => {
    it("should delete a cartItem", async () => {
      await app
        .service("users")
        .Model.findByIdAndDelete(usersServiceResults._id);

      await app
        .service("productPrice")
        .Model.findByIdAndDelete(productPriceCreated._id);
      await app.service("product").Model.findByIdAndDelete(productCreated._id);
      await app
        .service("productColor")
        .Model.findByIdAndDelete(productColorCreated._id);
      await app
        .service("productSize")
        .Model.findByIdAndDelete(productSizeCreated._id);

      const cartItemDeleted = await thisService.Model.findByIdAndDelete(
        cartItemCreated._id,
      );
      assert.strictEqual(
        cartItemDeleted._id.toString(),
        cartItemCreated._id.toString(),
      );
    });
  });
});
