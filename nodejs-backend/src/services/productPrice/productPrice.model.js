module.exports = function (app) {
  const modelName = "product_price";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      productName: {
        type: String,
        comment:
          "Product Name, p, false, true, true, true, true, true, true, , , , ,",
      },
      basePrice: {
        type: Number,
        max: 10000000,
        comment:
          "Base Price, currency, false, true, true, true, true, true, true, , , , ,",
      },
      currency: {
        type: Number,
        max: 10000000,
        comment:
          "Currency, currency, false, true, true, true, true, true, true, , , , ,",
      },
      discountedPrice: {
        type: String,
        comment:
          "Discounted Price, p, false, true, true, true, true, true, true, , , , ,",
      },
      taxPercentage: {
        type: String,
        comment:
          "Tax Percentage, p, false, true, true, true, true, true, true, , , , ,",
      },

      createdBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
      updatedBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
    },
    { timestamps: true },
  );

  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);
};
