
import { faker } from "@faker-js/faker";
export default (user,count) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
customerName: faker.lorem.sentence(1),
customerEmail: faker.lorem.sentence(1),
customerAddress: faker.lorem.sentence(1),
phoneNumber: faker.lorem.sentence(1),
gender: faker.lorem.sentence(1),
dateOfBirth: faker.lorem.sentence(1),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
