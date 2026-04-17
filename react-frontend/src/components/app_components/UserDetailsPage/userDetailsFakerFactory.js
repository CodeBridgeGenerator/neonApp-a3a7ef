
import { faker } from "@faker-js/faker";
export default (user,count,emailIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
fullName: faker.lorem.sentence(""),
phoneNumber: faker.lorem.sentence("8"),
email: emailIds[i % emailIds.length],
passwordHash: faker.lorem.sentence(""),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
