import { redis_client } from "../connection.redis.js";


export const setValue = async ({ key, value, ttl } = {}) => {
    try {
        value = typeof value == "string" ? value : JSON.stringify(value)
        ttl ?
            await redis_client.set(key, value, { EX: ttl }) :
            await redis_client.set(key, value,)

    } catch (error) {
        console.log(error, "\n redis setValue failed");

    }
}

export const update = async ({ key, value, ttl } = {}) => {
    try {
        if (!await redis_client.exists(key)) return 0
        await redis_client.set(key, value, { EX: ttl })

    } catch (error) {
        console.log(error, "\n redis updateValue failed");

    }
}

export const getValue = async (key) => {
    try {
        try {
            return JSON.parse(await redis_client.get(key))
        } catch (error) {
            return await redis_client.get(key)
        }

    } catch (error) {
        console.log(error, "\n redis getValue failed");

    }
}

export const ttl = async (key) => {
    try {
        return await redis_client.ttl(key)
    } catch (error) {
        console.log(error, "\n redis ttl failed");

    }
}

export const exists = async (key) => {
    try {
        return await redis_client.exists(key)
    } catch (error) {
        console.log(error, "\n redis exists failed");

    }
}

export const expires = async ({ key, ttl }) => {
    try {
        await redis_client.expire(key, ttl)
    } catch (error) {
        console.log(error, "\n redis expires failed");

    }
}

export const deleteKey = async (key) => {
    try {
        if (!key?.length) return 0
        await redis_client.del(key)
    } catch (error) {
        console.log(error, "\n redis deleteKey failed");

    }
}

export const keys = async (key) => {
    try {
        return await redis_client.keys(`${key}*`)
    } catch (error) {
        console.log(error, "\n redis keys failed");

    }
}

export const incr = async (key) => {
    try {
        return await redis_client.incr(key)
    } catch (error) {
        console.log(error, "\n redis incr failed");

    }
}