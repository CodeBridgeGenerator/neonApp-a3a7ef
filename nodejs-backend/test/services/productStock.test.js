const assert = require("assert");
const app = require("../../src/app");

let usersRefData = [
  {
    name: "Standard User",
    email: "standard@example.com",
    password: "password",
  },
];

describe("productStock service", async () => {
  let thisService;
  let productStockCreated;
  let usersServiceResults;
  let users;

  const productSizeCreated = await app.service("productSize").Model.create({"productName":"new value","colour":"new value","quantityAvailable":23,"lastRestockedDate":"2026-04-17T02:57:11.870Z","size":"parentObjectId","sizeCategory":"new value","sizeValue":"new value","stockQuantity":23,"availableSize":"new value"});

  beforeEach(async () => {
    thisService = await app.service("productStock");

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
          app.service("users").Model.findByIdAndDelete(i._id)
        )
      );
    }
  });

  it("registered the service", () => {
    assert.ok(thisService, "Registered the service (productStock)");
  });

  describe("#create", () => {
    const options = {"productName":"new value","colour":"new value","quantityAvailable":23,"lastRestockedDate":"2026-04-17T02:57:11.870Z","size":`${productSizeCreated._id}`,"sizeCategory":"new value","sizeValue":"new value","stockQuantity":23,"availableSize":"new value"};

    beforeEach(async () => {
      productStockCreated = await thisService.Model.create({...options, ...users});
    });

    it("should create a new productStock", () => {
      assert.strictEqual(productStockCreated.productName, options.productName);
assert.strictEqual(productStockCreated.colour, options.colour);
assert.strictEqual(productStockCreated.quantityAvailable, options.quantityAvailable);
assert.strictEqual(productStockCreated.lastRestockedDate.toISOString(), options.lastRestockedDate);
assert.strictEqual(productStockCreated.size.toString(), options.size.toString());
    });
  });

  describe("#get", () => {
    it("should retrieve a productStock by ID", async () => {
      const retrieved = await thisService.Model.findById(productStockCreated._id);
      assert.strictEqual(retrieved._id.toString(), productStockCreated._id.toString());
    });
  });

  describe("#update", () => {
    const options = {"productName":"updated value","colour":"updated value","quantityAvailable":100,"lastRestockedDate":"2026-04-17T02:57:11.870Z","size":`${productSizeCreated._id}`};

    it("should update an existing productStock ", async () => {
      const productStockUpdated = await thisService.Model.findByIdAndUpdate(
        productStockCreated._id, 
        options, 
        { new: true } // Ensure it returns the updated doc
      );
      assert.strictEqual(productStockUpdated.productName, options.productName);
assert.strictEqual(productStockUpdated.colour, options.colour);
assert.strictEqual(productStockUpdated.quantityAvailable, options.quantityAvailable);
assert.strictEqual(productStockUpdated.lastRestockedDate.toISOString(), options.lastRestockedDate);
assert.strictEqual(productStockUpdated.size.toString(), options.size.toString());
    });
  });

  describe("#delete", async () => {
    it("should delete a productStock", async () => {
      await app
        .service("users")
        .Model.findByIdAndDelete(usersServiceResults._id);

      await app.service("productSize").Model.findByIdAndDelete(productSizeCreated._id);;

      const productStockDeleted = await thisService.Model.findByIdAndDelete(productStockCreated._id);
      assert.strictEqual(productStockDeleted._id.toString(), productStockCreated._id.toString());
    });
  });
});