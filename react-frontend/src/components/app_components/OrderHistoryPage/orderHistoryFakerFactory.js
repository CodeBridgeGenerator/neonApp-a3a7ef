import { faker } from "@faker-js/faker";
export default (user, count) => {
  let data = [];
  for (let i = 0; i < count; i++) {
    const fake = {
      orderNumber: faker.datatype.boolean("8"),
      orderDate: faker.datatype.boolean(""),
      totalAmount: faker.datatype.boolean(""),
      orderStatus: faker.datatype.boolean(""),
      canReorder: faker.datatype.boolean(""),
      variantLabel: faker.datatype.boolean(""),
      favourite: faker.datatype.boolean(""),

      updatedBy: user._id,
      createdBy: user._id,
    };
    data = [...data, fake];
  }
  return data;
};
