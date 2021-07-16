import redis from 'redis';

export default function(connectionURL) {
    function connect(){
        return new Promise((resolve, reject) => {
            const client = redis.createClient(connectionURL);
    
            client.on('ready', () => {
                resolve(client);
            }).on('error', err => {
                reject(err);
            });
        });
    };

    return {
        getStat: function(params, callback) {

            let category = params[0],
                region = params[1],
                division = params[2],
                champions = params[3].split('+').filter((champ) => champ != 'all');

            connect().then((client) => {
                const multi = client.multi();
                
                champions.forEach(champion => {
                    multi.hgetall(`${category}_${region}_${division}_${champion}`);
                });

                multi.exec((err, replies) => {
                    if(err){
                        callback(null, err);
                    }
                    callback(replies.filter((reply => reply != null)), null);
                });
            }).catch((err) => {
                callback(null, err);
            });

        },

        getAll: function(params, callback){
            let category = params[0],
                region = params[1],
                division = params[2];

            connect().then((client) => {
                client.smembers(`${category}_${region}_${division}_all`, (err, result) => {
                    if(err){
                        callback(null, err);
                    }

                    const multi = client.multi();

                    result.forEach((entry) => {
                        multi.hgetall(entry);
                    });

                    multi.exec((err, replies) => {
                        if(err){
                            callback(null, err);
                        }
                        callback(replies, null);
                    });
                });
            }).catch((err) => {
                callback(null, err);
            });
        }
    };
};