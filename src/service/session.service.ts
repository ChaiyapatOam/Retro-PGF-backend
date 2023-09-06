import { Session } from "@/lib/prisma"

export const Create = async (userId: string, uuid: string) => {
    var now = new Date();
    var time = now.getTime();
    var expireTime = time + (1000 * 3600 * 48); // 2 days (1000 * 3600 * 24)/millisec
    now.setTime(expireTime);
    await Session.create({
        data: {
            id: uuid,
            user_id: userId,
            expires_at: now.toISOString()
        }
    })
}

export const Validate = async (id: string) => {
    const session = await Session.findUnique({
        where: { id: id }
    })

    if (!session) {
        return null
    }

    // Check Session Expire
    var now = new Date();
    if (session.expires_at < now) {
        // delete session
        await Session.delete({
            where: {
                id: id
            },
        })
        return null
    }
    return session
}

export const Delete = async (id: string) => {
    await Session.delete({
        where: {
            id: id
        },
    })
}