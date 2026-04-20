const assert = require("assert");
const app = require("../../src/app");

let usersRefData = [
  {
    name: "Standard User",
    email: "standard@example.com",
    password: "password",
  },
];

describe("product service", async () => {
  let thisService;
  let productCreated;
  let usersServiceResults;
  let users;

  const productPriceCreated = await app.service("productPrice").Model.create({
    productTitle: "new value",
    description: "new value",
    price: "parentObjectId",
    productName: "new value",
    basePrice: 23,
    currency: 23,
    discountedPrice: "new value",
    taxPercentage: "new value",
  });

  beforeEach(async () => {
    thisService = await app.service("product");

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
    assert.ok(thisService, "Registered the service (product)");
  });

  describe("#create", () => {
    const options = {
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
    };

    beforeEach(async () => {
      productCreated = await thisService.Model.create({ ...options, ...users });
    });

    it("should create a new product", () => {
      assert.strictEqual(productCreated.productTitle, options.productTitle);
      assert.strictEqual(productCreated.description, options.description);
      assert.strictEqual(
        productCreated.price.toString(),
        options.price.toString(),
      );
      assert.strictEqual(productCreated.productImage, options.productImage);
      assert.strictEqual(productCreated.smallImage, options.smallImage);
    });
  });

  describe("#get", () => {
    it("should retrieve a product by ID", async () => {
      const retrieved = await thisService.Model.findById(productCreated._id);
      assert.strictEqual(
        retrieved._id.toString(),
        productCreated._id.toString(),
      );
    });
  });

  describe("#update", () => {
    const options = {
      productTitle: "updated value",
      description: "updated value",
      price: `${productPriceCreated._id}`,
      productImage: "updated value",
      smallImage: "updated value",
    };

    it("should update an existing product ", async () => {
      const productUpdated = await thisService.Model.findByIdAndUpdate(
        productCreated._id,
        options,
        { new: true }, // Ensure it returns the updated doc
      );
      assert.strictEqual(productUpdated.productTitle, options.productTitle);
      assert.strictEqual(productUpdated.description, options.description);
      assert.strictEqual(
        productUpdated.price.toString(),
        options.price.toString(),
      );
      assert.strictEqual(productUpdated.productImage, options.productImage);
      assert.strictEqual(productUpdated.smallImage, options.smallImage);
    });
  });

  describe("#delete", async () => {
    it("should delete a product", async () => {
      await app
        .service("users")
        .Model.findByIdAndDelete(usersServiceResults._id);

      await app
        .service("productPrice")
        .Model.findByIdAndDelete(productPriceCreated._id);

      const productDeleted = await thisService.Model.findByIdAndDelete(
        productCreated._id,
      );
      assert.strictEqual(
        productDeleted._id.toString(),
        productCreated._id.toString(),
      );
    });
  });
});
