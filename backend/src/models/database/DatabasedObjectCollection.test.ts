import DatabasedObjectCollection from './DatabasedObjectCollection';
import { prismaMock } from '../../utils/prisma_singleton';
import Poll from '../Poll';
import QuestionFactory from '../QuestionFactory';
import * as IPoll from '../IPoll';
import { PrismaClient } from '@prisma/client';
import GenericObject from '../objects/GenericObject';

describe('DatabasedObjectCollection', () => {
    describe('setFromDatabaseData', () => {
        test('sets database data for two normal objects', () => {
            const proto = new Poll(prismaMock, new QuestionFactory(prismaMock));
            const collection = new DatabasedObjectCollection(proto);

            function setId(this: Poll, data: IPoll.DatabaseData) {
                this._id = data.id.toString();
            }

            Poll.prototype.setFromDatabaseData = setId;

            collection.setFromDatabaseData([{ id: 1 }, { id: 2 }]);

            expect(collection.values()['1'].id()).toBe('1');
            expect(collection.values()['2'].id()).toBe('2');
        });
    });

    describe('loadFromDatabase', () => {
        test('sets from given database data if found', async () => {
            const db = {
                poll: { findMany: (query: GenericObject) => [query.test, 2] }
            };

            const proto = new Poll(
                db as unknown as PrismaClient,
                new QuestionFactory(db as unknown as PrismaClient)
            );
            const collection = new DatabasedObjectCollection(proto);

            collection.setFromDatabaseData = jest.fn();

            await collection.loadFromDatabase({ test: 'test' });

            expect(collection.setFromDatabaseData).toHaveBeenCalledWith([
                'test',
                2
            ]);
        });
    });
});
