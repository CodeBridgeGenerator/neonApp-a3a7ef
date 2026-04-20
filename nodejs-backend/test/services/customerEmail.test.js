const assert = require("assert");
const app = require("../../src/app");

let usersRefData = [
  {
    name: "Standard User",
    email: "standard@example.com",
    password: "password",
  },
];

describe("customerEmail service", async () => {
  let thisService;
  let customerEmailCreated;
  let usersServiceResults;
  let users;

  beforeEach(async () => {
    thisService = await app.service("customerEmail");

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
    assert.ok(thisService, "Registered the service (customerEmail)");
  });

  describe("#create", () => {
    const options = { email: "new value", fullName: "new value" };

    beforeEach(async () => {
      customerEmailCreated = await thisService.Model.create({
        ...options,
        ...users,
      });
    });

    it("should create a new customerEmail", () => {
      assert.strictEqual(customerEmailCreated.email, options.email);
      assert.strictEqual(customerEmailCreated.fullName, options.fullName);
    });
  });

  describe("#get", () => {
    it("should retrieve a customerEmail by ID", async () => {
      const retrieved = await thisService.Model.findById(
        customerEmailCreated._id,
      );
      assert.strictEqual(
        retrieved._id.toString(),
        customerEmailCreated._id.toString(),
      );
    });
  });

  describe("#update", () => {
    const options = { email: "updated value", fullName: "updated value" };

    it("should update an existing customerEmail ", async () => {
      const customerEmailUpdated = await thisService.Model.findByIdAndUpdate(
        customerEmailCreated._id,
        options,
        { new: true }, // Ensure it returns the updated doc
      );
      assert.strictEqual(customerEmailUpdated.email, options.email);
      assert.strictEqual(customerEmailUpdated.fullName, options.fullName);
    });
  });

  describe("#delete", async () => {
    it("should delete a customerEmail", async () => {
      await app
        .service("users")
        .Model.findByIdAndDelete(usersServiceResults._id);

      const customerEmailDeleted = await thisService.Model.findByIdAndDelete(
        customerEmailCreated._id,
      );
      assert.strictEqual(
        customerEmailDeleted._id.toString(),
        customerEmailCreated._id.toString(),
      );
    });
  });
});
