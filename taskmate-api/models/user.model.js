// models/user.model.js
const execQuery = require('../helpers/execQuery');
const TYPES = require('tedious').TYPES;

const addUser = (userData) => {
    const { uid, username, password, imageUrl } = userData;
    const query = `
    INSERT INTO [dbo].[Users] (uid, username, password, imageUrl) 
    VALUES(@uid, @username, @password, @imageUrl)
    `;
    const params = [
        { name: 'uid', type: TYPES.UniqueIdentifier, value: uid },
        { name: 'username', type: TYPES.VarChar, value: username },
        { name: 'password', type: TYPES.Char, value: password },
        { name: 'imageUrl', type: TYPES.VarChar, value: imageUrl },
    ];
    return execQuery.execWriteCommand(query, params);
};

const getUserByUsername = (username) => {
    const query = `
    SELECT * FROM [dbo].[Users] WHERE username = @username
    `;
    const params = [
        { name: 'username', type: TYPES.VarChar, value: username },
    ];
    return execQuery.execReadCommand(query, params);
};
const getidUserByUsername = async (username) => {
    const query = `SELECT uid FROM [dbo].[Users] WHERE username = @username`;
    const params = [{ name: 'username', type: TYPES.VarChar, value: username }];
    const result = await execQuery.execReadCommand(query, params);
    return result.length > 0 ? result[0] : null;
};

const getidUser = async (uid) => {
    const query = `
    SELECT uid FROM [dbo].[Users] WHERE uid = @uid
    `;
    const params = [
        { name: 'uid', type: TYPES.UniqueIdentifier, value: uid },
    ];
    const result = await execQuery.execReadCommand(query, params);
    return result.length > 0 ? result[0] : null;
};

const updateUserImageUrl = (uid, imageUrl) => {
    const query = `UPDATE [dbo].[Users] SET imageUrl = @imageUrl WHERE uid = @uid`;
    const params = [{ name: 'imageUrl', type: TYPES.VarChar, value: imageUrl }, { name: 'uid', type: TYPES.UniqueIdentifier, value: uid }];
    return execQuery.execWriteCommand(query, params);
};

module.exports = {
    addUser,
    getUserByUsername,
    getidUser,
    getidUserByUsername,
    updateUserImageUrl,
};
