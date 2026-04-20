import { faker } from "@faker-js/faker";
export default (user, count) => {
  let data = [];
  for (let i = 0; i < count; i++) {
    const fake = {
      productName: faker.lorem.sentence(1),
      customerName: faker.lorem.sentence(1),
      averageStarRating: faker.lorem.sentence(1),
      totalReviewCount: faker.lorem.sentence(1),

      updatedBy: user._id,
      createdBy: user._id,
    };
    data = [...data, fake];
  }
  return data;
};
