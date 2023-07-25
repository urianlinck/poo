import express, { Request, Response } from "express";
import cors from "cors";
import { db } from "./database/knex";
import { TVideo } from "./types";
import { Videos } from "./models/Videos";

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
        const videos = await db("Videos")
        let classes = []
        for (const video of videos){
            const videoClass = new Videos(
                video.id,
                video.title,
                video.duration,
                video.uploadDate
            )
            classes.push(videoClass)
        }

        let result = []
        for (const video of classes){
            const videoType: TVideo = {
                id:video.getId(),
                title: video.getTitle(),
                duration: video.getDuration(),
                upload_date: video.getUpDate()
            }
            result.push(videoType)
        }

        res.status(200).send(result)
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
        const id = req.body.id;
        const title = req.body.title;
        const duration = req.body.duration;
        const upload_date = new Date().toISOString()

        const [idExist] = await db("videos").where({id})

        if(idExist){
            res.status(400)
            throw new Error("ID já registrada.")
        }
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

        const video = new Videos(
            id, title, duration, upload_date
        )

        const newVideo: TVideo = {
            id: video.getId(),
            title: video.getTitle(),
            duration: video.getDuration(),
            upload_date: video.getUpDate()
        }

        await db("videos").insert(newVideo)
        res.status(200).send("Vídeo carreado.")

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
        const id = req.params.id as string
        const title = req.body.title as string | undefined
        const duration = req.body.durations as number| undefined

        const [idExist] = await db("videos").where({id})

        if(!idExist) {
            res.status(400)
            throw new Error("ID do vídeo não encontrada.")
        }

        if(idExist){
            const video = new Videos(idExist.id, idExist.title, idExist.duration, idExist.uploadDate)
            if(title){
                video.setTitle(title)
            }
            if(duration){
                video.setDuration(duration)
            }

            const editedVideo: TVideo = {
                id: video.getId(),
                title: video.getTitle(),
                duration: video.getDuration(),
                upload_date: video.getUpDate()
            }

            await db("videos").update(editedVideo).where({id})

            res.status(200).send("Vídeo atualizado.")
        }
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
        const id = req.params.id as string

        const [idExist] = await db("videos").where({id})

        if(!idExist){
        res.status(400)
        throw new Error("Vídeo não encontrado.")
        }

        const video = new Videos(idExist.id, idExist.title, idExist.duration, idExist.uploadDate)

        await db("videos").del().where({id: video.getId()})

        res.status(200).send("Vídeo deletado.")

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