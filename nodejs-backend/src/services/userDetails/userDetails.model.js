
    module.exports = function (app) {
        const modelName = "user_details";
        const mongooseClient = app.get("mongooseClient");
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            fullName: { type:  String , comment: "Full Name, p, false, true, true, true, true, true, true, , , , ," },
phoneNumber: { type:  String , maxLength: 150, index: true, trim: true, comment: "Phone Number, p, false, true, true, true, true, true, true, , , , ," },
email: { type: Schema.Types.ObjectId, ref: "customer_email", comment: "Email , dropdown, false, true, true, true, true, true, true, customerEmail, customer_email, one-to-one, email," },
passwordHash: { type:  String , comment: "Password Hash, p, false, true, true, true, true, true, true, , , , ," },

            createdBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
            updatedBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
          }, { timestamps: true });
      
       
        if (mongooseClient.modelNames().includes(modelName)) {
          mongooseClient.deleteModel(modelName);
        }
        return mongooseClient.model(modelName, schema);
        
      };