
    module.exports = function (app) {
        const modelName = "order_history";
        const mongooseClient = app.get("mongooseClient");
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            orderNumber: { type:  String , maxLength: 150, index: true, trim: true, comment: "Order Number, p, false, true, true, true, true, true, true, , , , ," },
orderDate: { type: Date, comment: "Order Date, p_date, false, true, true, true, true, true, true, , , , ," },
totalAmount: { type: Number, max: 10000000, comment: "Total Amount, currency, false, true, true, true, true, true, true, , , , ," },
orderStatus: { type:  String , comment: "Order Status, p, false, true, true, true, true, true, true, , , , ," },
canReorder: { type: Boolean, required: false, comment: "Can Reorder, p_boolean, false, true, true, true, true, true, true, , , , ," },
variantLabel: { type:  String , comment: "Variant Label, p, false, true, true, true, true, true, true, , , , ," },
favourite: { type: Boolean, required: false, comment: "Favourite, p_boolean, false, true, true, true, true, true, true, , , , ," },

            createdBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
            updatedBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
          }, { timestamps: true });
      
       
        if (mongooseClient.modelNames().includes(modelName)) {
          mongooseClient.deleteModel(modelName);
        }
        return mongooseClient.model(modelName, schema);
        
      };