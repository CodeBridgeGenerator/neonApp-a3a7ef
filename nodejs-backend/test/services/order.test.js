const assert = require("assert");
const app = require("../../src/app");

let usersRefData = [
  {
    name: "Standard User",
    email: "standard@example.com",
    password: "password",
  },
];

describe("order service", async () => {
  let thisService;
  let orderCreated;
  let usersServiceResults;
  let users;

  const customerDetailsCreated = await app
    .service("customerDetails")
    .Model.create({
      customerName: "new value",
      customerEmail: "new value",
      customerAddress: "new value",
      phoneNumber: "new value",
      gender: "new value",
      dateOfBirth: "2026-04-17T02:57:11.973Z",
    });

  beforeEach(async () => {
    thisService = await app.service("order");

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
    assert.ok(thisService, "Registered the service (order)");
  });

  describe("#create", () => {
    const options = {
      customerName: `${customerDetailsCreated._id}`,
      customerEmail: "new value",
      customerAddress: "new value",
      phoneNumber: "new value",
      gender: "new value",
      dateOfBirth: "2026-04-17T02:57:11.973Z",
      total: "new value",
    };

    beforeEach(async () => {
      orderCreated = await thisService.Model.create({ ...options, ...users });
    });

    it("should create a new order", () => {
      assert.strictEqual(
        orderCreated.customerName.toString(),
        options.customerName.toString(),
      );
      assert.strictEqual(orderCreated.total, options.total);
    });
  });

  describe("#get", () => {
    it("should retrieve a order by ID", async () => {
      const retrieved = await thisService.Model.findById(orderCreated._id);
      assert.strictEqual(retrieved._id.toString(), orderCreated._id.toString());
    });
  });

  describe("#update", () => {
    const options = {
      customerName: `${customerDetailsCreated._id}`,
      total: "updated value",
    };

    it("should update an existing order ", async () => {
      const orderUpdated = await thisService.Model.findByIdAndUpdate(
        orderCreated._id,
        options,
        { new: true }, // Ensure it returns the updated doc
      );
      assert.strictEqual(
        orderUpdated.customerName.toString(),
        options.customerName.toString(),
      );
      assert.strictEqual(orderUpdated.total, options.total);
    });
  });

  describe("#delete", async () => {
    it("should delete a order", async () => {
      await app
        .service("users")
        .Model.findByIdAndDelete(usersServiceResults._id);

      await app
        .service("customerDetails")
        .Model.findByIdAndDelete(customerDetailsCreated._id);

      const orderDeleted = await thisService.Model.findByIdAndDelete(
        orderCreated._id,
      );
      assert.strictEqual(
        orderDeleted._id.toString(),
        orderCreated._id.toString(),
      );
    });
  });
});
