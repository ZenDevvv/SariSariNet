import express, { Router } from "express";
import { PrismaClient } from "../../../generated/prisma";
import { controller } from "./transaction.controller";
import { router } from "./transaction.router";

export const transactionModule = (prisma: PrismaClient): Router => {
	return router(express.Router(), controller(prisma), prisma);
};
