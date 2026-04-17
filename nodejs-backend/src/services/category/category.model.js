
    module.exports = function (app) {
        const modelName = "category";
        const mongooseClient = app.get("mongooseClient");
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            brandName: { type:  String , maxLength: 150, index: true, trim: true, comment: "Brand Name, p, false, true, true, true, true, true, true, , , , ," },
gender: { type:  String , comment: "Gender, p, false, true, true, true, true, true, true, , , , ," },
isSale: { type: Boolean, required: false, comment: "is Sale, p_boolean, false, true, true, true, true, true, true, , , , ," },
productPrice: { type: Number, max: 10000000, comment: "Product Price, currency, false, true, true, true, true, true, true, , , , ," },
productImage: { type:  String , comment: "Product Image, image, false, true, true, true, true, true, true, , , , ," },
productSearch: { type:  String , comment: "Product Search, p, false, true, true, true, true, true, true, , , , ," },
sortBy: { type:  String , maxLength: 150, index: true, trim: true, comment: "Sort By, p, false, true, true, true, true, true, true, , , , ," },
, comment: "Filter By, dropdownArray, false, true, true, true, true, true, true, , , , ," },

            createdBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
            updatedBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
          }, { timestamps: true });
      
       
        if (mongooseClient.modelNames().includes(modelName)) {
          mongooseClient.deleteModel(modelName);
        }
        return mongooseClient.model(modelName, schema);
        
      };