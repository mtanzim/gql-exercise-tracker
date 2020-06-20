BEGIN TRANSACTION;
DROP TABLE IF EXISTS "exercise_instance";
CREATE TABLE IF NOT EXISTS "exercise_instance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sessionId" INTEGER NOT NULL,
    "duration" REAL,
    "repetitions" INTEGER,
    "weight" REAL,
    FOREIGN KEY(sessionId) REFERENCES exercise_session(id)
);
DROP TABLE IF EXISTS "exercise_session";
CREATE TABLE IF NOT EXISTS "exercise_session" (
    "id" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "timestamp" INTEGER NOT NULL,
    "note" TEXT,
    PRIMARY KEY("id"),
    FOREIGN KEY(userId) REFERENCES user(id)
);
DROP TABLE IF EXISTS "exercise";
CREATE TABLE IF NOT EXISTS "exercise" (
    "name" TEXT NOT NULL UNIQUE,
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "label" TEXT NOT NULL
);
DROP TABLE IF EXISTS "user";
CREATE TABLE IF NOT EXISTS "user" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "email" TEXT NOT NULL UNIQUE
);
COMMIT;