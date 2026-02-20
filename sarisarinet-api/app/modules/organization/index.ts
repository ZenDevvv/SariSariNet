import express, { Router } from "express";
import { PrismaClient } from "../../../generated/prisma";
import { controller } from "./organization.controller";
import { router } from "./organization.router";

export const organizationModule = (prisma: PrismaClient): Router => {
	return router(express.Router(), controller(prisma), prisma);
};
