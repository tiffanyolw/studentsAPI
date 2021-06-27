module.exports.isValidStudent = function isValidStudent(body) {
    if ("name" in body && "section" in body 
        && "gpa" in body && "nationality" in body) {
        return true;
    }
    return false;
};