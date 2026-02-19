import express, { Router } from "express";
import { PrismaClient } from "../../../generated/prisma";
import { controller } from "./report.controller";
import { router } from "./report.router";

export const reportModule = (prisma: PrismaClient): Router => {
	return router(express.Router(), controller(prisma), prisma);
};
