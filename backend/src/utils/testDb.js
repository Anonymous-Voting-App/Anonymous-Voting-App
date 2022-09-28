var testDb = {};

testDb.makeTestDb = function (responses = {}) {
    var db = {};

    db.findFirst = function (query) {
        if (responses.findFirst) {
            return responses.findFirst(query);
        }

        return null;
    };

    db.create = function (query) {
        if (responses.create) {
            return responses.create(query);
        }

        return null;
    };

    return db;
};

module.exports = testDb;
