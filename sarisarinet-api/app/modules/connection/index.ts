import express, { Router } from "express";
import { PrismaClient } from "../../../generated/prisma";
import { controller } from "./connection.controller";
import { router } from "./connection.router";

export const connectionModule = (prisma: PrismaClient): Router => {
	return router(express.Router(), controller(prisma), prisma);
};
