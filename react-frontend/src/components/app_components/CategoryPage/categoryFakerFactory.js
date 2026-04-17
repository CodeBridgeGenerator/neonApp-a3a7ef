
import { faker } from "@faker-js/faker";
export default (user,count) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
brandName: faker.lorem.sentence("8"),
gender: faker.lorem.sentence(""),
isSale: faker.lorem.sentence(""),
productPrice: faker.lorem.sentence(""),
productImage: faker.lorem.sentence(""),
productSearch: faker.lorem.sentence(""),
sortBy: faker.lorem.sentence("8"),
filterBy: faker.lorem.sentence(""),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
