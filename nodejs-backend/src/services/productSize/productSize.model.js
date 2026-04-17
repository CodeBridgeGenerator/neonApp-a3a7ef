
    module.exports = function (app) {
        const modelName = "product_size";
        const mongooseClient = app.get("mongooseClient");
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            productName: { type:  String , comment: "Product Name, p, false, true, true, true, true, true, true, , , , ," },
sizeCategory: { type:  String , comment: "Size Category, p, false, true, true, true, true, true, true, , , , ," },
sizeValue: { type:  String , comment: "Size Value, p, false, true, true, true, true, true, true, , , , ," },
stockQuantity: { type: Number, max: 10000000, comment: "Stock Quantity, p_number, false, true, true, true, true, true, true, , , , ," },
availableSize: { type:  String , comment: "Available Size, p, false, true, true, true, true, true, true, , , , ," },

            createdBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
            updatedBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
          }, { timestamps: true });
      
       
        if (mongooseClient.modelNames().includes(modelName)) {
          mongooseClient.deleteModel(modelName);
        }
        return mongooseClient.model(modelName, schema);
        
      };