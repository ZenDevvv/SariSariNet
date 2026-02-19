import { z } from "zod";

export const GenderTypeEnum = z.enum([
	"male",
	"female",
	"other",
	"prefer_not_to_say",
	"unknown",
	"not_applicable",
]);
export type GenderType = z.infer<typeof GenderTypeEnum>;

export const PhoneTypeEnum = z.enum([
	"mobile",
	"home",
	"work",
	"emergency",
	"fax",
	"pager",
	"main",
	"other",
]);
export type PhoneType = z.infer<typeof PhoneTypeEnum>;

export const IdentificationTypeEnum = z.enum([
	"passport",
	"drivers_license",
	"national_id",
	"postal_id",
	"voters_id",
	"senior_citizen_id",
	"company_id",
	"school_id",
]);
export type IdentificationType = z.infer<typeof IdentificationTypeEnum>;

export const phoneSchema = z.object({
	type: PhoneTypeEnum.optional(),
	countryCode: z.string().optional(),
	number: z.string().optional(),
	isPrimary: z.boolean().optional(),
});

export const contactAddressSchema = z.object({
	street: z.string().optional(),
	address2: z.string().optional(),
	city: z.string().optional(),
	state: z.string().optional(),
	country: z.string().optional(),
	postalCode: z.string().optional(),
	zipCode: z.string().optional(),
	houseNumber: z.string().optional(),
});

export const contactInfoSchema = z.object({
	email: z.string().email().optional(),
	phones: z.array(phoneSchema).optional(),
	fax: z.string().optional(),
	address: contactAddressSchema.optional(),
});

export const identificationSchema = z.object({
	type: IdentificationTypeEnum.optional(),
	number: z.string().optional(),
	issuingCountry: z.string().optional(),
	expiryDate: z.date().optional(),
});

export const personalInfoSchema = z.object({
	prefix: z.string().optional(),
	firstName: z.string().min(1),
	middleName: z.string().optional(),
	lastName: z.string().min(1),
	dateOfBirth: z.date().optional(),
	placeOfBirth: z.string().optional(),
	age: z.number().int().min(0).optional(),
	nationality: z.string().optional(),
	primaryLanguage: z.string().optional(),
	gender: GenderTypeEnum.optional(),
	currency: z.string().optional(),
	vipCode: z.string().optional(),
});

export const metadataSchema = z.object({
	isActive: z.boolean().default(true),
	status: z.string().optional(),
	createdBy: z.string().optional(), // ObjectId as string
	updatedBy: z.string().optional(), // ObjectId as string
	lastLoginAt: z.date().nullable().optional(),
	isDeleted: z.boolean().default(false),
});

export const personSchema = z.object({
	id: z.string(),
	organizationId: z.string().optional(), // ObjectId as string
	personalInfo: personalInfoSchema.optional(),
	contactInfo: contactInfoSchema.optional(),
	identification: identificationSchema.optional(),
	metadata: metadataSchema.optional(),
});

export const createPersonSchema = personSchema.omit({ id: true });

export const updatePersonSchema = personSchema.omit({ id: true }).partial();

export type Person = z.infer<typeof personSchema>;
