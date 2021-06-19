module.exports.isValidStudent = function isValidStudent(body) {
    if ("id" in body && "name" in body && "section" in body 
        && "gpa" in body && "nationality" in body) {
        return true;
    }
    return false;
};

module.exports.doesIdExist = function doesIdExist(arr, id) {
    for (let i = 0; i < arr.length; i ++) {
        if (arr[i].id === id) {
            return true;
        }
    }
    return false;
}
