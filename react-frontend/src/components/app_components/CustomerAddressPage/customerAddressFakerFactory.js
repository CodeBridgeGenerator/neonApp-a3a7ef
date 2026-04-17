
import { faker } from "@faker-js/faker";
export default (user,count) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
customerName: faker.lorem.sentence(1),
addressType: faker.lorem.sentence(1),
country: faker.lorem.sentence(1),
addressLine1: faker.lorem.sentence(1),
addressLine2: faker.lorem.sentence(1),
city: faker.lorem.sentence(1),
postalCode: faker.lorem.sentence(1),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
