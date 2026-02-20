import { z } from "zod";
import { PaginationSchema, ObjectIdSchema } from "./common.zod";

export const SettlementNoteSchema = z.object({
	id: ObjectIdSchema,
	borrowingRecordId: ObjectIdSchema,
	note: z.string(),
	actorUserId: ObjectIdSchema,
	isDeleted: z.boolean(),
	createdBy: ObjectIdSchema.optional().nullable(),
	updatedBy: ObjectIdSchema.optional().nullable(),
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

export type GetAllSettlementNotes = z.infer<typeof GetAllSettlementNotesSchema>;
