import express, { Router } from "express";
import { PrismaClient } from "../../../generated/prisma";
import { controller } from "./user.controller";
import { router } from "./user.router";

export const userModule = (prisma: PrismaClient): Router => {
	return router(express.Router(), controller(prisma), prisma);
};
