const assert = require("assert");
const app = require("../../src/app");

let usersRefData = [
  {
    name: "Standard User",
    email: "standard@example.com",
    password: "password",
  },
];

describe("userDetails service", async () => {
  let thisService;
  let userDetailCreated;
  let usersServiceResults;
  let users;

  const customerEmailCreated = await app.service("customerEmail").Model.create({
    fullName: "new value",
    phoneNumber: "new value",
    email: "new value",
  });

  beforeEach(async () => {
    thisService = await app.service("userDetails");

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
    assert.ok(thisService, "Registered the service (userDetails)");
  });

  describe("#create", () => {
    const options = {
      fullName: "new value",
      phoneNumber: "new value",
      email: `${customerEmailCreated._id}`,
      passwordHash: "new value",
    };

    beforeEach(async () => {
      userDetailCreated = await thisService.Model.create({
        ...options,
        ...users,
      });
    });

    it("should create a new userDetail", () => {
      assert.strictEqual(userDetailCreated.fullName, options.fullName);
      assert.strictEqual(userDetailCreated.phoneNumber, options.phoneNumber);
      assert.strictEqual(
        userDetailCreated.email.toString(),
        options.email.toString(),
      );
      assert.strictEqual(userDetailCreated.passwordHash, options.passwordHash);
    });
  });

  describe("#get", () => {
    it("should retrieve a userDetail by ID", async () => {
      const retrieved = await thisService.Model.findById(userDetailCreated._id);
      assert.strictEqual(
        retrieved._id.toString(),
        userDetailCreated._id.toString(),
      );
    });
  });

  describe("#update", () => {
    const options = {
      fullName: "updated value",
      phoneNumber: "updated value",
      email: `${customerEmailCreated._id}`,
      passwordHash: "updated value",
    };

    it("should update an existing userDetail ", async () => {
      const userDetailUpdated = await thisService.Model.findByIdAndUpdate(
        userDetailCreated._id,
        options,
        { new: true }, // Ensure it returns the updated doc
      );
      assert.strictEqual(userDetailUpdated.fullName, options.fullName);
      assert.strictEqual(userDetailUpdated.phoneNumber, options.phoneNumber);
      assert.strictEqual(
        userDetailUpdated.email.toString(),
        options.email.toString(),
      );
      assert.strictEqual(userDetailUpdated.passwordHash, options.passwordHash);
    });
  });

  describe("#delete", async () => {
    it("should delete a userDetail", async () => {
      await app
        .service("users")
        .Model.findByIdAndDelete(usersServiceResults._id);

      await app
        .service("customerEmail")
        .Model.findByIdAndDelete(customerEmailCreated._id);

      const userDetailDeleted = await thisService.Model.findByIdAndDelete(
        userDetailCreated._id,
      );
      assert.strictEqual(
        userDetailDeleted._id.toString(),
        userDetailCreated._id.toString(),
      );
    });
  });
});
