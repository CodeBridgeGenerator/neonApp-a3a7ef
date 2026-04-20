module.exports = function (app) {
  const modelName = "checkout";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      fullName: {
        type: String,
        comment:
          "FullName, p, false, true, true, true, true, true, true, , , , ,",
      },
      productName: {
        type: Schema.Types.ObjectId,
        ref: "product",
        comment:
          "Product Name, dropdown, false, true, true, true, true, true, true, product, product, one-to-one, productTitle:description:price:productImage,",
      },
      subtotal: {
        type: Number,
        max: 10000000,
        comment:
          "Subtotal, p_number, false, true, true, true, true, true, true, , , , ,",
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
