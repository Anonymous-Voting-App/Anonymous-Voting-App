/**
 * An object that can have its data
 * exposed either as a public data object
 * or a private data object.
 */
export default interface SecurelyExposable {
    privateDataObj(): object;
    publicDataObj(): object;
}
