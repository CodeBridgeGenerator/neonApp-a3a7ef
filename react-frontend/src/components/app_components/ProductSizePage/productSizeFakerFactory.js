import { faker } from "@faker-js/faker";
export default (user, count) => {
  let data = [];
  for (let i = 0; i < count; i++) {
    const fake = {
      productName: faker.lorem.sentence(1),
      sizeCategory: faker.lorem.sentence(1),
      sizeValue: faker.lorem.sentence(1),
      stockQuantity: faker.lorem.sentence(1),
      availableSize: faker.lorem.sentence(1),

      updatedBy: user._id,
      createdBy: user._id,
    };
    data = [...data, fake];
  }
  return data;
};
