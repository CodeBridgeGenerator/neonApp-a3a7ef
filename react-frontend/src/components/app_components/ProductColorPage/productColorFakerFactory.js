
import { faker } from "@faker-js/faker";
export default (user,count) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
productName: faker.lorem.sentence(1),
colorName: faker.lorem.sentence(1),
colorCode: faker.lorem.sentence(1),
colorImage: faker.lorem.sentence(1),
defaultColor: faker.lorem.sentence(1),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
