const assert = require("assert");
const app = require("../../src/app");

let usersRefData = [
  {
    name: "Standard User",
    email: "standard@example.com",
    password: "password",
  },
];

describe("orderHistory service", async () => {
  let thisService;
  let orderHistoryCreated;
  let usersServiceResults;
  let users;

  

  beforeEach(async () => {
    thisService = await app.service("orderHistory");

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
    assert.ok(thisService, "Registered the service (orderHistory)");
  });

  describe("#create", () => {
    const options = {"orderNumber":"new value","orderDate":"2026-04-17T02:57:12.009Z","totalAmount":23,"orderStatus":"new value","canReorder":true,"variantLabel":"new value","favourite":true};

    beforeEach(async () => {
      orderHistoryCreated = await thisService.Model.create({...options, ...users});
    });

    it("should create a new orderHistory", () => {
      assert.strictEqual(orderHistoryCreated.orderNumber, options.orderNumber);
assert.strictEqual(orderHistoryCreated.orderDate.toISOString(), options.orderDate);
assert.strictEqual(orderHistoryCreated.totalAmount, options.totalAmount);
assert.strictEqual(orderHistoryCreated.orderStatus, options.orderStatus);
assert.strictEqual(orderHistoryCreated.canReorder, options.canReorder);
assert.strictEqual(orderHistoryCreated.canReorder, options.canReorder);
assert.strictEqual(orderHistoryCreated.variantLabel, options.variantLabel);
assert.strictEqual(orderHistoryCreated.favourite, options.favourite);
assert.strictEqual(orderHistoryCreated.favourite, options.favourite);
    });
  });

  describe("#get", () => {
    it("should retrieve a orderHistory by ID", async () => {
      const retrieved = await thisService.Model.findById(orderHistoryCreated._id);
      assert.strictEqual(retrieved._id.toString(), orderHistoryCreated._id.toString());
    });
  });

  describe("#update", () => {
    const options = {"orderNumber":"updated value","orderDate":"2026-04-17T02:57:12.009Z","totalAmount":100,"orderStatus":"updated value","canReorder":false,"variantLabel":"updated value","favourite":false};

    it("should update an existing orderHistory ", async () => {
      const orderHistoryUpdated = await thisService.Model.findByIdAndUpdate(
        orderHistoryCreated._id, 
        options, 
        { new: true } // Ensure it returns the updated doc
      );
      assert.strictEqual(orderHistoryUpdated.orderNumber, options.orderNumber);
assert.strictEqual(orderHistoryUpdated.orderDate.toISOString(), options.orderDate);
assert.strictEqual(orderHistoryUpdated.totalAmount, options.totalAmount);
assert.strictEqual(orderHistoryUpdated.orderStatus, options.orderStatus);
assert.strictEqual(orderHistoryUpdated.canReorder, options.canReorder);
assert.strictEqual(orderHistoryUpdated.canReorder, options.canReorder);
assert.strictEqual(orderHistoryUpdated.variantLabel, options.variantLabel);
assert.strictEqual(orderHistoryUpdated.favourite, options.favourite);
assert.strictEqual(orderHistoryUpdated.favourite, options.favourite);
    });
  });

  describe("#delete", async () => {
    it("should delete a orderHistory", async () => {
      await app
        .service("users")
        .Model.findByIdAndDelete(usersServiceResults._id);

      ;

      const orderHistoryDeleted = await thisService.Model.findByIdAndDelete(orderHistoryCreated._id);
      assert.strictEqual(orderHistoryDeleted._id.toString(), orderHistoryCreated._id.toString());
    });
  });
});