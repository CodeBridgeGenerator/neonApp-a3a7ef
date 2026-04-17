
import { faker } from "@faker-js/faker";
export default (user,count,productNameIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
fullName: faker.lorem.sentence(1),
productName: productNameIds[i % productNameIds.length],
subtotal: faker.lorem.sentence(1),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
