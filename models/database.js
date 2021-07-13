import redis from 'redis';

export default function(host, port) {
    function connect(){
        return new Promise((resolve, reject) => {
            const client = redis.createClient({
                host: host,
                port: port,
            });
    
            client.on('ready', () => {
                resolve(client);
            }).on('error', err => {
                reject(err);
            });
        });
    };

    return {
        getStats: function(params, callback) {

            let category = params[0],
                region = params[1],
                division = params[2],
                champions = params[3].split('+');

            connect().then((client) => {
                const multi = client.multi();
                
                champions.forEach(champion => {
                    multi.hgetall(`${category}_${region}_${division}_${champion}`);
                });

                multi.exec((err, replies) => {
                    if(err){
                        callback(null, err);
                    }
                    callback(replies.filter((reply => reply != null)), null)
                })
            }).catch((err) => {
                callback(null, err);
            });

        }
    };
};