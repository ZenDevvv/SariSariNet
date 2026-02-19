import express, { Router } from "express";
import { PrismaClient } from "../../../generated/prisma";
import { controller } from "./systemMetric.controller";
import { router } from "./systemMetric.router";

export const systemMetricModule = (prisma: PrismaClient): Router => {
	return router(express.Router(), controller(prisma));
};
