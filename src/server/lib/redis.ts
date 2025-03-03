import { Redis } from 'ioredis';

// Redis 클라이언트 인스턴스를 전역 변수로 관리
let redisClient: Redis | null = null;

// 최초 요청이 올 때 Redis 인스턴스를 생성하는 함수
export function getRedisClient(): Redis {
    if (!redisClient) {
        redisClient = new Redis({
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT),
            password: process.env.REDIS_PASSWORD,
        });
    }
    return redisClient;
}
