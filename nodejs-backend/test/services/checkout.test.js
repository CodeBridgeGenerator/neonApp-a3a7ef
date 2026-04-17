const assert = require("assert");
const app = require("../../src/app");

let usersRefData = [
  {
    name: "Standard User",
    email: "standard@example.com",
    password: "password",
  },
];

describe("checkout service", async () => {
  let thisService;
  let checkoutCreated;
  let usersServiceResults;
  let users;

  const productPriceCreated = await app.service("productPrice").Model.create({"fullName":"new value","productName":"new value","productTitle":"new value","description":"new value","price":"parentObjectId","basePrice":23,"currency":23,"discountedPrice":"new value","taxPercentage":"new value"});
const productCreated = await app.service("product").Model.create({"fullName":"new value","productName":"new value","productTitle":"new value","description":"new value","price":`${productPriceCreated._id}`,"basePrice":23,"currency":23,"discountedPrice":"new value","taxPercentage":"new value","productImage":"new value","smallImage":"new value"});

  beforeEach(async () => {
    thisService = await app.service("checkout");

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
    assert.ok(thisService, "Registered the service (checkout)");
  });

  describe("#create", () => {
    const options = {"fullName":"new value","productName":`${productCreated._id}`,"productTitle":"new value","description":"new value","price":`${productPriceCreated._id}`,"basePrice":23,"currency":23,"discountedPrice":"new value","taxPercentage":"new value","productImage":"new value","smallImage":"new value","subtotal":23};

    beforeEach(async () => {
      checkoutCreated = await thisService.Model.create({...options, ...users});
    });

    it("should create a new checkout", () => {
      assert.strictEqual(checkoutCreated.fullName, options.fullName);
assert.strictEqual(checkoutCreated.productName.toString(), options.productName.toString());
assert.strictEqual(checkoutCreated.subtotal, options.subtotal);
    });
  });

  describe("#get", () => {
    it("should retrieve a checkout by ID", async () => {
      const retrieved = await thisService.Model.findById(checkoutCreated._id);
      assert.strictEqual(retrieved._id.toString(), checkoutCreated._id.toString());
    });
  });

  describe("#update", () => {
    const options = {"fullName":"updated value","productName":`${productCreated._id}`,"subtotal":100};

    it("should update an existing checkout ", async () => {
      const checkoutUpdated = await thisService.Model.findByIdAndUpdate(
        checkoutCreated._id, 
        options, 
        { new: true } // Ensure it returns the updated doc
      );
      assert.strictEqual(checkoutUpdated.fullName, options.fullName);
assert.strictEqual(checkoutUpdated.productName.toString(), options.productName.toString());
assert.strictEqual(checkoutUpdated.subtotal, options.subtotal);
    });
  });

  describe("#delete", async () => {
    it("should delete a checkout", async () => {
      await app
        .service("users")
        .Model.findByIdAndDelete(usersServiceResults._id);

      await app.service("productPrice").Model.findByIdAndDelete(productPriceCreated._id);
await app.service("product").Model.findByIdAndDelete(productCreated._id);;

      const checkoutDeleted = await thisService.Model.findByIdAndDelete(checkoutCreated._id);
      assert.strictEqual(checkoutDeleted._id.toString(), checkoutCreated._id.toString());
    });
  });
});