import InstanceCollection from './InstanceCollection';

describe('InstanceCollection', () => {
    describe('gather', () => {
        test('existing method gathers correctly with no args', async () => {
            const collection = new InstanceCollection('test');

            let num = 0;
            function test() {
                return num++;
            }

            const obj1 = { test: test };
            const obj2 = { test: test };

            collection.add(obj1);
            collection.add(obj2);

            const gathered = await collection.gather('test');

            expect(gathered).toEqual({
                '0': 2,
                '1': 3
            });
        });
    });
});
