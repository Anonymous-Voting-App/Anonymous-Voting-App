import { PrismaClient } from '@prisma/client';
import Any from '../objects/Any';
import GenericObject from '../objects/GenericObject';

/**
 * An object that is connected to a Prisma database.
 */
export default interface DatabasedObject extends Any {
    database(): PrismaClient;

    databaseTable(): string;

    loadFromDatabase(): void;

    setFromDatabaseData(data: GenericObject): void;

    createNewInDatabase(): void;

    id(): string;

    clone(): DatabasedObject;
}
