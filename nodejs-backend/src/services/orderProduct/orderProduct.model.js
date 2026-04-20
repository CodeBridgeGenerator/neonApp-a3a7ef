module.exports = function (app) {
  const modelName = "order_product";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      productName: {
        type: String,
        comment:
          "Product Name, p, false, true, true, true, true, true, true, , , , ,",
      },
      quantity: {
        type: Number,
        max: 10000000,
        comment:
          "Quantity, p_number, false, true, true, true, true, true, true, , , , ,",
      },
      selectedColor: {
        type: String,
        comment:
          "Selected Color, p, false, true, true, true, true, true, true, , , , ,",
      },
      selectedSize: {
        type: String,
        comment:
          "Selected Size, p, false, true, true, true, true, true, true, , , , ,",
      },
      unitPrice: {
        type: Number,
        max: 10000000,
        comment:
          "Unit Price, currency, false, true, true, true, true, true, true, , , , ,",
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
