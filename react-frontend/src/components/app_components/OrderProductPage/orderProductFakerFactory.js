import { faker } from "@faker-js/faker";
export default (user, count) => {
  let data = [];
  for (let i = 0; i < count; i++) {
    const fake = {
      productName: faker.lorem.sentence(1),
      quantity: faker.lorem.sentence(1),
      selectedColor: faker.lorem.sentence(1),
      selectedSize: faker.lorem.sentence(1),
      unitPrice: faker.lorem.sentence(1),

      updatedBy: user._id,
      createdBy: user._id,
    };
    data = [...data, fake];
  }
  return data;
};
