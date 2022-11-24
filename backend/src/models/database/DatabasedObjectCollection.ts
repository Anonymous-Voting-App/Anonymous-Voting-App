import InstanceCollection from '../objects/InstanceCollection';
import { pre, post } from '../../utils/designByContract';
import DatabasedObject from './DatabasedObject';
import GenericObject from '../objects/GenericObject';

/**
 * Collection of objects that are connectable to
 * a Prisma database. All objects are assumed to
 * be of the same class.
 */

export default class DatabasedObjectCollection extends InstanceCollection {
    _values: { [id: string]: DatabasedObject } = {};
    _objPrototype: DatabasedObject;

    /** Prototype object that is used for creating new objects. */

    objPrototype(): DatabasedObject {
        return this._objPrototype;
    }

    /** Sets value of objPrototype. */

    setObjPrototype(objPrototype: DatabasedObject): void {
        this._objPrototype = objPrototype;

        post(
            '_objPrototype is objPrototype',
            this._objPrototype === objPrototype
        );
    }

    /** DatabasedObjects in the collection. */

    values(): { [id: string]: DatabasedObject } {
        return this._values;
    }

    /** Sets value of values. */

    setValues(values: { [id: string]: DatabasedObject }): void {
        pre('argument values is of type object', typeof values === 'object');

        this._values = values;

        post('_values is values', this._values === values);
    }

    constructor(objPrototype: DatabasedObject) {
        super('id');

        this._objPrototype = objPrototype;
    }

    /**
     * Creates new DatabasedObjects from prototype
     * from given array of database datas. Database datas
     * are assumed to be such that they can be
     * given to the prototype's .setFromDatabaseData() method.
     */

    setFromDatabaseData(datas: Array<GenericObject>): void {
        for (let i = 0; i < datas.length; i++) {
            const data = datas[i];

            const obj = this.objPrototype().clone();

            obj.setFromDatabaseData(data);

            this.values()[obj.id()] = obj;
        }
    }

    /**
     * Loads data from prototype's database table using given query
     * and does this.setFromDatabaseData() with that data.
     */

    async loadFromDatabase(query: GenericObject): Promise<void> {
        const proto = this.objPrototype();
        const db = proto.database() as GenericObject;

        const datas = await db[proto.databaseTable()].findMany(query);

        if (datas !== null) {
            this.setFromDatabaseData(datas);
        }
    }
}
