import express, { Router } from "express";
import { PrismaClient } from "../../../generated/prisma";
import { controller } from "./borrowing.controller";
import { router } from "./borrowing.router";

export const borrowingModule = (prisma: PrismaClient): Router => {
	return router(express.Router(), controller(prisma), prisma);
};
