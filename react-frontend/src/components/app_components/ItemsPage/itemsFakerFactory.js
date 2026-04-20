import { faker } from "@faker-js/faker";
export default (user, count, orderIds) => {
  let data = [];
  for (let i = 0; i < count; i++) {
    const fake = {
      order: orderIds[i % orderIds.length],
      quantity: faker.lorem.sentence(1),
      productPrice: faker.lorem.sentence(1),
      amount: faker.lorem.sentence(1),

      updatedBy: user._id,
      createdBy: user._id,
    };
    data = [...data, fake];
  }
  return data;
};
