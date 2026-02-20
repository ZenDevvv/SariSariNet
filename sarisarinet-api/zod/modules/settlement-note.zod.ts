import { z } from "zod";
import { isValidObjectId } from "mongoose";
import { PaginationSchema } from "../common.zod";

export const SettlementNoteSchema = z.object({
	id: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }),
	borrowingRecordId: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }),
	note: z.string(),
	actorUserId: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }),
	isDeleted: z.boolean(),
	createdBy: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }).optional().nullable(),
	updatedBy: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }).optional().nullable(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export const CreateSettlementNoteSchema = SettlementNoteSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
}).partial({
	isDeleted: true,
	createdBy: true,
	updatedBy: true,
});

export const UpdateSettlementNoteSchema = SettlementNoteSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	isDeleted: true,
}).partial();

export const GetAllSettlementNotesSchema = z.object({
	settlementNotes: z.array(SettlementNoteSchema),
	pagination: PaginationSchema.optional(),
	count: z.number().optional(),
});

export type SettlementNote = z.infer<typeof SettlementNoteSchema>;
export type CreateSettlementNote = z.infer<typeof CreateSettlementNoteSchema>;
export type UpdateSettlementNote = z.infer<typeof UpdateSettlementNoteSchema>;
