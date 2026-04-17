const assert = require("assert");
const app = require("../../src/app");

let usersRefData = [
  {
    name: "Standard User",
    email: "standard@example.com",
    password: "password",
  },
];

describe("orderProduct service", async () => {
  let thisService;
  let orderProductCreated;
  let usersServiceResults;
  let users;

  

  beforeEach(async () => {
    thisService = await app.service("orderProduct");

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
    assert.ok(thisService, "Registered the service (orderProduct)");
  });

  describe("#create", () => {
    const options = {"productName":"new value","quantity":23,"selectedColor":"new value","selectedSize":"new value","unitPrice":23};

    beforeEach(async () => {
      orderProductCreated = await thisService.Model.create({...options, ...users});
    });

    it("should create a new orderProduct", () => {
      assert.strictEqual(orderProductCreated.productName, options.productName);
assert.strictEqual(orderProductCreated.quantity, options.quantity);
assert.strictEqual(orderProductCreated.selectedColor, options.selectedColor);
assert.strictEqual(orderProductCreated.selectedSize, options.selectedSize);
assert.strictEqual(orderProductCreated.unitPrice, options.unitPrice);
    });
  });

  describe("#get", () => {
    it("should retrieve a orderProduct by ID", async () => {
      const retrieved = await thisService.Model.findById(orderProductCreated._id);
      assert.strictEqual(retrieved._id.toString(), orderProductCreated._id.toString());
    });
  });

  describe("#update", () => {
    const options = {"productName":"updated value","quantity":100,"selectedColor":"updated value","selectedSize":"updated value","unitPrice":100};

    it("should update an existing orderProduct ", async () => {
      const orderProductUpdated = await thisService.Model.findByIdAndUpdate(
        orderProductCreated._id, 
        options, 
        { new: true } // Ensure it returns the updated doc
      );
      assert.strictEqual(orderProductUpdated.productName, options.productName);
assert.strictEqual(orderProductUpdated.quantity, options.quantity);
assert.strictEqual(orderProductUpdated.selectedColor, options.selectedColor);
assert.strictEqual(orderProductUpdated.selectedSize, options.selectedSize);
assert.strictEqual(orderProductUpdated.unitPrice, options.unitPrice);
    });
  });

  describe("#delete", async () => {
    it("should delete a orderProduct", async () => {
      await app
        .service("users")
        .Model.findByIdAndDelete(usersServiceResults._id);

      ;

      const orderProductDeleted = await thisService.Model.findByIdAndDelete(orderProductCreated._id);
      assert.strictEqual(orderProductDeleted._id.toString(), orderProductCreated._id.toString());
    });
  });
});