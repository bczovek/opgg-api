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

            connect().then((client) => {
                client.hgetall(params.join('_').toLowerCase(), callback);
            }).catch((err) => {
                callback(err, null);
            });

        }
    };
};