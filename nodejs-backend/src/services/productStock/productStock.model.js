
    module.exports = function (app) {
        const modelName = "product_stock";
        const mongooseClient = app.get("mongooseClient");
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            productName: { type:  String , comment: "Product Name, p, false, true, true, true, true, true, true, , , , ," },
colour: { type:  String , comment: "Colour, p, false, true, true, true, true, true, true, , , , ," },
quantityAvailable: { type: Number, max: 10000000, comment: "Quantity Available, p_number, false, true, true, true, true, true, true, , , , ," },
lastRestockedDate: { type: Date, comment: "Last Restocked Date, p_date, false, true, true, true, true, true, true, , , , ," },
size: { type: [Schema.Types.ObjectId], ref: "product_size", description: "isArray", comment: "Size, multiselect, false, true, true, true, true, true, true, productSize, product_size, one-to-many, productName:sizeCategory:sizeValue:stockQuantity:availableSize," },

            createdBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
            updatedBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
          }, { timestamps: true });
      
       
        if (mongooseClient.modelNames().includes(modelName)) {
          mongooseClient.deleteModel(modelName);
        }
        return mongooseClient.model(modelName, schema);
        
      };