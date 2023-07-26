import express, { Request, Response } from "express";
import cors from "cors";
import { BaseDatabase } from "./database/BaseDatabase";
import { TVideo } from "./types";
import { Videos } from "./models/Videos";
import { VideoDatabase } from "./database/VideoDatabase";

const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
    console.log(`Servidor rodando na porta ${3003}`)
})

app.get("/ping", async (req: Request, res: Response) => {
    try {
        res.status(200).send({ message: "Pong!" })
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.get("/videos", async (req: Request, res: Response) => {
    try{
        const q = req.query.q as string

        const videoDatabase = new VideoDatabase()

        const videosDB = await videoDatabase.findVideos(q)

        const videos: Videos[] = videosDB.map((videoDB) => new Videos(
            videoDB.id,
            videoDB.title,
            videoDB.duration,
            videoDB.upload_date
        ))

        res.status(200).send(videos)

    }catch (error) {
        console.log(error);

        if(req.statusCode = 200){
            res.status(500);
        }
        if(error instanceof Error){
            res.send(error.message);
        }else{
            res.send("Erro inesperado.")
        }
    }
});

app.post("/videos", async (req: Request, res: Response) =>{
    try{
        const {id, title, duration} = req.body

        if(!id || !title || !duration){
            res.status(400)
            throw new Error("Campos obrigatórios.")
        }
        if(typeof id !== "string"){
            res.status(400);
            throw new Error("'ID' precisa ser uma string.")
        }
        if(typeof title !== "string"){
            res.status(400);
            throw new Error("'Titulo' precisa ser uma string.")
        }
        if(typeof duration !== "number"){
            res.status(400);
            throw new Error("'Duração' precisa ser um número.")
        }

        const videoDatabase = new VideoDatabase()

        const videoDBExists = await videoDatabase.findVideoById(id)

        if (videoDBExists){
            res.status(400)
            throw new Error("ID já existe.")
        }

        const newVideo = new Videos( 
            id,
            title,
            duration,
            new Date().toISOString()
        )

        const newVideoDB: TVideo = {
            id: newVideo.getId(),
            title: newVideo.getTitle(),
            duration: newVideo.getDuration(),
            upload_date: newVideo.getUpDate()
        }

        await videoDatabase.insertVideo(newVideoDB)

        res.status(201).send(newVideo)

    }catch (error) {
        console.log(error);

        if(req.statusCode = 200){
            res.status(500);
        }
        if(error instanceof Error){
            res.send(error.message);
        }else{
            res.send("Erro inesperado.")
        }
    }
});

app.put("/videos/:id", async (req: Request, res: Response) => {
    try {
        const idExist = req.params.id
        const {id, title, duration, uploadDate} = req.body

        if (id !== undefined){
            if (typeof id !== "string") {
                res.status(400)
                throw new Error("ID deve ser uma string.")
            }
        }

        if (title !== undefined) {
            if (typeof title !== "string") {
                res.status(400)
                throw new Error("Título deve ser uma string.")
            }
        }

        if (duration !== undefined) {
            if (typeof duration !== "number") {
                res.status(400)
                throw new Error("Duração deve ser um número.")
            }
        }
        
        if (uploadDate !== undefined) {
            if (typeof uploadDate !== "string") {
                res.status(400)
                throw new Error("Data de upload deve ser uma string.")
            }
        }

        const videoDatabase = new VideoDatabase()

        const videoDB = await videoDatabase.findVideoById(idExist)

        if (!videoDB) {
            res.status(400)
            throw new Error("ID não encontrado.")
        }

        const video = new Videos(
            videoDB.id,
            videoDB.title,
            videoDB.duration,
            videoDB.upload_date
        )

        id && video.setId(id)
        title && video.setTitle(title)
        duration && video.setDuration(duration)
        uploadDate && video.setUpDate(uploadDate)

        const updatedVideoDB: TVideo = {
            id: video.getId(),
            title: video.getTitle(),
            duration: video.getDuration(),
            upload_date: video.getUpDate()
        }

        await videoDatabase.updateVideo(idExist, updatedVideoDB)

        res.status(200).send(video)

    }catch (error) {
        console.log(error);

        if(req.statusCode = 200){
            res.status(500);
        }
        if(error instanceof Error){
            res.send(error.message);
        }else{
            res.send("Erro inesperado.")
        }
    }
});

app.delete("/videos/:id", async (req: Request, res: Response) =>{
    try{
        const id = req.params.id 

        const videoDatabase = new VideoDatabase()

        const videoDB = await videoDatabase.findVideoById(id)

        if (!videoDB){
            res.status(400)
            throw new Error("Id não encontrado.")
        }
        
        await videoDatabase.deleteVideo(id)

        res.status(200).end()

    }catch (error) {
        console.log(error);

        if(req.statusCode = 200){
            res.status(500);
        }
        if(error instanceof Error){
            res.send(error.message);
        }else{
            res.send("Erro inesperado.")
        }
    }
});