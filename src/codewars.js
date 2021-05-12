const got = require('got');

exports.getUserInfo = (username) => {
    return got.get(`https://www.codewars.com/api/v1/users/${username}`, {responseType: 'json'})
        .then(res => {
            const user_info = JSON.parse(res.body);
            return {
                username: user_info.username,
                honor: user_info.honor,
                rank: user_info.ranks.overall.name,
                completed: user_info.codeChallenges.totalCompleted,
            }
        })
        .catch(err => {
            console.log('Error: ', err.message);
        });
};
