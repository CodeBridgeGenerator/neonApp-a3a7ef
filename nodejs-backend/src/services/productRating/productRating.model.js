module.exports = function (app) {
  const modelName = "product_rating";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      productName: {
        type: String,
        comment:
          "Product Name, p, false, true, true, true, true, true, true, , , , ,",
      },
      customerName: {
        type: String,
        comment:
          "Customer Name, p, false, true, true, true, true, true, true, , , , ,",
      },
      averageStarRating: {
        type: Number,
        max: 10000000,
        comment:
          "Average Star Rating, rating, false, true, true, true, true, true, true, , , , ,",
      },
      totalReviewCount: {
        type: Number,
        max: 10000000,
        comment:
          "Total Review Count, progressBar, false, true, true, true, true, true, true, , , , ,",
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
