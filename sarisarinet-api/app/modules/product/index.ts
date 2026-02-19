import express, { Router } from "express";
import { PrismaClient } from "../../../generated/prisma";
import { controller } from "./product.controller";
import { router } from "./product.router";

export const productModule = (prisma: PrismaClient): Router => {
	return router(express.Router(), controller(prisma), prisma);
};
