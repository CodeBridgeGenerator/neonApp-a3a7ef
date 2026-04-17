
import { faker } from "@faker-js/faker";
export default (user,count,customerNameIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
customerName: customerNameIds[i % customerNameIds.length],
total: faker.lorem.sentence(1),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
