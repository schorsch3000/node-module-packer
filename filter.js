module.exports = {}
module.exports.tag = function (filter, list) {
    if (filter === false) return [];
    if (filter === true) return list;
    if (typeof filter == 'string') {
        filter = [filter]
    }
    var semver = require('semver')
    if (filter instanceof Array) {
        for (var i in filter) {
            var item = filter[i];
            var filteredList = [];
            if (item == 'valid') {
                for (var j in list) {
                    var listItem = list[j];
                    if (semver.valid(listItem)) {
                        filteredList.push(listItem)
                    } else {
                        console.log("invalid:", listItem)
                    }

                }
            } else {
                for (var j in list) {
                    var listItem = list[j];
                    if (semver.satisfies(listItem, item)) {
                        filteredList.push(semver.clean(listItem))
                    } else {
                        console.log("does not satisfy range(", item, "):", listItem)
                    }

                }
            }
            list = filteredList;
        }
        return list
    }
}
module.exports.branch = function (filter, list) {
    if (filter === false) return [];
    if (filter === true) return list;
    var filteredList = [];
    if (typeof filter == 'string') {
        filter = [filter]
    }
    if (filter instanceof Array) {
        for (var i in filter) {
            var item = filter[i];
            if (list.indexOf(item) >= 0) {
                filteredList.push(item)
            }
        }
        return filteredList
    }
}