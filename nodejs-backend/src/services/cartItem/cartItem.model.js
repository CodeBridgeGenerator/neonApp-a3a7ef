
    module.exports = function (app) {
        const modelName = "cart_item";
        const mongooseClient = app.get("mongooseClient");
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            productName: { type: [Schema.Types.ObjectId], ref: "product", description: "isArray", comment: "Product Name, multiselect, false, true, true, true, true, true, true, product, product, one-to-many, productTitle:description," },
colour: { type: [Schema.Types.ObjectId], ref: "product_color", description: "isArray", comment: "Colour, multiselect, false, true, true, true, true, true, true, productColor, product_color, one-to-many, colorName:colorCode:colorImage," },
size: { type: [Schema.Types.ObjectId], ref: "product_size", description: "isArray", comment: "Size, multiselect, false, true, true, true, true, true, true, productSize, product_size, one-to-many, sizeValue:stockQuantity:availableSize," },

            createdBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
            updatedBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
          }, { timestamps: true });
      
       
        if (mongooseClient.modelNames().includes(modelName)) {
          mongooseClient.deleteModel(modelName);
        }
        return mongooseClient.model(modelName, schema);
        
      };