import { pre, post } from '../../utils/designByContract';
import GenericObject from '../objects/GenericObject';

/**
 * Collection of instance objects (i.e objects that are instances of a class)
 * that have a unique id method. All objects
 * are assumed to be of the same class.
 */

export default class InstanceCollection {
    _idMethod: string;
    _values: { [id: string]: GenericObject } = {};

    /** Instances in the collection. */

    values(): { [id: string]: GenericObject } {
        return this._values;
    }

    /** Sets value of values. */

    setValues(values: { [id: string]: GenericObject }): void {
        pre('argument values is of type object', typeof values === 'object');

        this._values = values;

        post('_values is values', this._values === values);
    }

    /** Name of id method that tells an instance's unique id. */

    idMethod(): string {
        return this._idMethod;
    }

    /** Sets value of idMethod. */

    setIdMethod(idMethod: string): void {
        pre(
            'argument idMethod is of type string',
            typeof idMethod === 'string'
        );

        this._idMethod = idMethod;

        post('_idMethod is idMethod', this._idMethod === idMethod);
    }

    constructor(idMethod: string) {
        pre('idMethod is of type string', typeof idMethod === 'string');

        this._idMethod = idMethod;
    }

    /**
     * Adds an instance to collection to the key according
     * to the value returned by the instance's id method.
     */

    add(instance: GenericObject): void {
        this.values()[instance[this.idMethod()]()] = instance;
    }

    /**
     * Calls given method with given args on all instance's in the collection.
     * Results are gathered into an object hashmap (where instance id is key)
     * and returned.
     */

    async gather(
        method: string,
        args: Array<any> = []
    ): Promise<{ [id: string]: GenericObject }> {
        const result: { [id: string]: any } = {};

        for (const id in this.values()) {
            const instance = this.values()[id];

            result[id] = await instance[method](...args);
        }

        return result;
    }
}
