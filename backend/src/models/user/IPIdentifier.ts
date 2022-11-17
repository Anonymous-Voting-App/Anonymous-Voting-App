import { pre, post } from '../../utils/designByContract';
import IdentifyingFeature from './IdentifyingFeature';
import * as IFingerprint from './IFingerprint';
import { FindInDbQuery, PrivateData } from './IIdentifyingFeature';
import { PrismaClient } from '@prisma/client';

/**
 *
 */

export default class IPIdentifier extends IdentifyingFeature {
    privateDataObj(): PrivateData {
        throw new Error('Method not implemented.');
    }

    _ip = '';

    /**  */

    ip(): string {
        return this._ip;
    }

    /** Sets value of ip. */

    setIp(ip: string): void {
        pre('argument ip is of type string', typeof ip === 'string');

        this._ip = ip;

        post('_ip is ip', this._ip === ip);
    }

    constructor(database: PrismaClient) {
        super(database);
    }

    /**
     *
     */

    initialize(ip: string): IPIdentifier {
        this.setIp(ip);

        return this;
    }

    /**
     *
     */

    isSameAs(other: IdentifyingFeature): boolean {
        if (other instanceof IPIdentifier) {
            return other.ip() === this.ip();
        }

        return false;
    }

    /**
     *
     */

    setFromDatabaseData(data: IFingerprint.DatabaseData): void {
        pre('data.ip is of type string', typeof data.ip === 'string');

        this.setIp(data.ip);
    }

    findSelfInDatabaseQuery(): FindInDbQuery {
        return {
            where: {
                ip: this.ip()
            }
        };
    }
}
