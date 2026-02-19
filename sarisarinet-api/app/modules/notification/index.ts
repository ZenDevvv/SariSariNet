import express, { Router } from "express";
import { PrismaClient } from "../../../generated/prisma";
import { controller } from "./notification.controller";
import { router } from "./notification.router";

export const notificationModule = (prisma: PrismaClient): Router => {
	return router(express.Router(), controller(prisma), prisma);
};
