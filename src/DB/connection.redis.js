
import { createClient } from "redis"

export const redis_client = createClient({
    url: "rediss://default:gQAAAAAAA5UWAAIgcDFiMjhiMDQ5MjRlYjA0OGRjYmE2ZDcyNjM5OGMxMTk1OA@lenient-roughy-234774.upstash.io:6379"
});
export const redisConnection = async () => {
    try {

        await redis_client.connect();
        console.log("redis connected successfuly");

    } catch (error) {
        console.log("redis failed to connect");
    }
}





