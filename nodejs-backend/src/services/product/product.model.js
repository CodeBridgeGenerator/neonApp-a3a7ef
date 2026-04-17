
    module.exports = function (app) {
        const modelName = "product";
        const mongooseClient = app.get("mongooseClient");
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            productTitle: { type:  String , comment: "Product Title, p, false, true, true, true, true, true, true, , , , ," },
description: { type:  String , comment: "Description, inputTextarea, false, true, true, true, true, true, true, , , , ," },
price: { type: [Schema.Types.ObjectId], ref: "product_price", description: "isArray", comment: "Price, multiselect, false, true, true, true, true, true, true, productPrice, product_price, one-to-many, productName:basePrice:currency:discountedPrice:taxPercentage," },
productImage: { type:  String , comment: "Product Image, image, false, true, true, true, true, true, true, , , , ," },
smallImage: { type:  String , comment: "Small Image, image, false, true, true, true, true, true, true, , , , ," },

            createdBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
            updatedBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
          }, { timestamps: true });
      
       
        if (mongooseClient.modelNames().includes(modelName)) {
          mongooseClient.deleteModel(modelName);
        }
        return mongooseClient.model(modelName, schema);
        
      };