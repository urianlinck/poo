import { TVideo } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class VideoDatabase extends BaseDatabase {
    public static TABLE_VIDEOS = "videos"

    public findVideos = async (q?: string): Promise<TVideo[]> => {
        let result: TVideo[]

        if (q){
            result = await BaseDatabase
            .connection(VideoDatabase.TABLE_VIDEOS)
            .where("name", "LIKE", `%${q}%`)
        } else {
            result = await BaseDatabase
            .connection(VideoDatabase.TABLE_VIDEOS)
        }

        return result
    }

    public async findVideoById(id: string): Promise<TVideo | undefined> {
        const [response]: TVideo[] = await BaseDatabase
        .connection(VideoDatabase.TABLE_VIDEOS)
        .where({id})

        return response
    }

    public insertVideo = async (videoDB: TVideo): Promise<void> => {
        await BaseDatabase
        .connection(VideoDatabase.TABLE_VIDEOS)
        .insert(videoDB)
    }

    public updateVideo = async (idExist: string, updatedVideoDB: TVideo): Promise<void> => {
        await BaseDatabase
        .connection(VideoDatabase.TABLE_VIDEOS)
        .update(updatedVideoDB)
        .where({id: idExist})
    }

    public deleteVideo = async (id: string): Promise<void> => {
        await BaseDatabase
        .connection(VideoDatabase.TABLE_VIDEOS)
        .delete()
        .where({id})
    }
}