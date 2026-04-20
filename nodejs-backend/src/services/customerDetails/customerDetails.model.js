module.exports = function (app) {
  const modelName = "customer_details";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      customerName: {
        type: String,
        comment:
          "Customer Name, p, false, true, true, true, true, true, true, , , , ,",
      },
      customerEmail: {
        type: String,
        comment:
          "Customer Email, p, false, true, true, true, true, true, true, , , , ,",
      },
      customerAddress: {
        type: String,
        comment:
          "Customer Address, p, false, true, true, true, true, true, true, , , , ,",
      },
      phoneNumber: {
        type: String,
        comment:
          "Phone Number, p, false, true, true, true, true, true, true, , , , ,",
      },
      gender: {
        type: String,
        comment:
          "Gender, p, false, true, true, true, true, true, true, , , , ,",
      },
      dateOfBirth: {
        type: Date,
        comment:
          "Date Of Birth, p_date, false, true, true, true, true, true, true, , , , ,",
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
