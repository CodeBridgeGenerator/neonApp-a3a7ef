
    module.exports = function (app) {
        const modelName = "items";
        const mongooseClient = app.get("mongooseClient");
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            order: { type: [Schema.Types.ObjectId], ref: "order", description: "isArray", comment: "Order, dropdown, false, true, true, true, true, true, true, order, order, one-to-one, customerName:total," },
product: { type: [Schema.Types.ObjectId], ref: "product", description: "isArray", comment: "Product, multiselect, false, true, true, true, true, true, true, product, product, one-to-many, productTitle:productImage," },
quantity: { type: Number, max: 10000000, comment: "Quantity, p_number, false, true, true, true, true, true, true, , , , ," },
productPrice: { type: Number, max: 10000000, comment: "Product Price, currency, false, true, true, true, true, true, true, , , , ," },
amount: { type: Number, max: 10000000, comment: "Amount, p_number, false, true, true, true, true, true, true, , , , ," },

            createdBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
            updatedBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
          }, { timestamps: true });
      
       
        if (mongooseClient.modelNames().includes(modelName)) {
          mongooseClient.deleteModel(modelName);
        }
        return mongooseClient.model(modelName, schema);
        
      };