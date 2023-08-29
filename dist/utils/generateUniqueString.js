"use strict";
const generateUniqueString = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    let uniqueString = "";
    for (let i = 0; i < 36; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        uniqueString += characters.charAt(randomIndex);
    }
    return uniqueString;
};
//# sourceMappingURL=generateUniqueString.js.map