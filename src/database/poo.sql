-- Active: 1690214988622@@127.0.0.1@3306

CREATE TABLE
    videos (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        title TEXT NOT NULL,
        duration REAL NOT NULL,
        upload_date TEXT DEFAULT (DATETIME()) NOT NULL
    );

INSERT INTO
    videos (id, title, duration)
VALUES ('v001', 'POO-aula', 600), ('v002', 'POO-exercicios', 1000);

SELECT * FROM videos;