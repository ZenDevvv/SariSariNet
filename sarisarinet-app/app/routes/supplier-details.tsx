import {
	ArrowLeft,
	Building2,
	AlertCircle,
	Star,
	MapPin,
	Package,
	DollarSign,
	ShoppingCart,
	Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useSearchParams } from "react-router";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import type { CreateSupplier } from "~/zod/supplier.zod";
import { useGetSupplierById, useUpdateSupplier } from "~/hooks/use-supplier";
import { useParams } from "react-router";
import { SupplierProductsTable } from "~/components/organisms/supplier-items-table";
import { UpsertSupplierForm } from "~/components/forms/upsert-supplier-form";
import { PAGE_TITLES } from "~/configs/page-titles";
import type { Route } from "./+types/supplier-details";

export function meta({}: Route.MetaArgs) {
	return [{ title: PAGE_TITLES.supplier }];
}

function SupplierSkeleton() {
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-10 w-32" />
			</div>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<Skeleton className="h-32" />
				<Skeleton className="h-32" />
				<Skeleton className="h-32" />
			</div>
			<Card>
				<CardHeader>
					<Skeleton className="h-6 w-32" />
				</CardHeader>
				<CardContent>
					<Skeleton className="h-4 w-64" />
				</CardContent>
			</Card>
		</div>
	);
}

export default function SupplierDetail() {
	const params = useParams();
	const supplierId = params.id as string;
	const [searchParams, setSearchParams] = useSearchParams();
	const action = searchParams.get("action");
	const isOpen = action === "edit";
	const { data: supplier, isLoading } = useGetSupplierById(supplierId, {
		fields: "id,code,name,createdAt,updatedAt,contactPerson,email,phone,address,gln,isActive,items.id,items.product.id,items.product.name,items.product.gtin,items.product.sku,items.product.category.id,items.product.category.name,items.product.productType.id,items.product.productType.name",
	});
	const updateSupplier = useUpdateSupplier();

	const handleUpdateSupplier = async (data: CreateSupplier) => {
		const mutationPromise = updateSupplier.mutateAsync({ supplierId, data });

		await toast.promise(mutationPromise, {
			loading: "Updating Supplier...",
			success: () => ({
				message: "Supplier Updated",
			}),
			error: () => ({
				message: "Supplier Update Failed",
			}),
		});

		setSearchParams({});
	};

	const handleClose = () => {
		setSearchParams({});
	};

	if (isLoading) {
		return <SupplierSkeleton />;
	}

	if (!supplier) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="text-center">
					<AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
					<h3 className="text-lg font-semibold">Supplier not found</h3>
					<p className="text-sm text-muted-foreground">
						The supplier you're looking for doesn't exist.
					</p>
				</div>
			</div>
		);
	}

	const productsCount = supplier.items.length || 0;

	const address = supplier.address || {};
	const fullAddress = [
		address.street,
		address.city,
		address.state,
		address.postalCode,
		address.country,
	]
		.filter(Boolean)
		.join(", ");

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center gap-4">
				<Button variant="ghost" size="icon" asChild>
					<Link to="/suppliers">
						<ArrowLeft className="size-4" />
					</Link>
				</Button>
				<div className="flex-1">
					{/* <div className="flex items-center gap-3">
						<h1 className="font-semibold text-3xl text-balance">Supplier Details</h1>
						<Badge variant={supplier.isActive ? "default" : "secondary"}>
							{supplier.isActive ? "Active" : "Inactive"}
						</Badge>
					</div> */}
				</div>
				<Button variant="outline" onClick={() => setSearchParams({ action: "edit" })}>
					<Pencil className="mr-2 size-4" />
					Edit Supplier
				</Button>
			</div>

			<Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
				<DialogContent className="sm:max-w-2xl">
					<DialogHeader>
						<DialogTitle>Edit Supplier</DialogTitle>
						<DialogDescription>Update supplier details below.</DialogDescription>
					</DialogHeader>
					<UpsertSupplierForm
						supplierId={supplierId}
						onSubmit={handleUpdateSupplier}
						onCancel={handleClose}
					/>
				</DialogContent>
			</Dialog>

			<div className="grid gap-6 lg:grid-cols-2">
				{/* Supplier Information */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Building2 className="size-5" />
							Supplier Information
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4 text-sm">
						<div className="grid gap-4">
							<div className="flex justify-between">
								<span className="text-muted-foreground">Name</span>
								<span className="font-medium">
									{supplier.name || "N/A"}{" "}
									<Badge variant="outline">{supplier.code}</Badge>
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Contact Person</span>
								<span className="font-medium">
									{supplier.contactPerson || "N/A"}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Email</span>
								<span className="font-medium">{supplier.email || "N/A"}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Phone</span>
								<span className="font-medium">{supplier.phone || "N/A"}</span>
							</div>
							<div className="flex justify-between gap-4">
								<span className="text-muted-foreground">Address</span>
								<span className="font-medium">{fullAddress || "N/A"}</span>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Overview Card */}
				<Card className="h-full">
					<CardHeader className="pb-3">
						<CardTitle>Overview</CardTitle>
					</CardHeader>
					<CardContent className="flex-1 flex flex-col justify-between space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{/* Created Date */}
							<div className="space-y-2 flex-1">
								<div className="flex items-center gap-2">
									<div className="p-2 rounded-full bg-muted w-fit">
										<Star className="size-4 text-muted-foreground" />
									</div>
									<p className="text-sm font-medium">Date Created</p>
								</div>
								<div className="font-bold text-2xl">
									{new Date(supplier.createdAt).toLocaleDateString()}
								</div>
								<p className="text-xs text-muted-foreground">Date joined</p>
							</div>

							{/* Products Count */}
							<div className="space-y-2 flex-1">
								<div className="flex items-center gap-2">
									<div className="p-2 rounded-full bg-muted w-fit">
										<Package className="size-4 text-muted-foreground" />
									</div>
									<p className="text-sm font-medium">Products</p>
								</div>
								<div className="font-bold text-2xl">{productsCount}</div>
								<p className="text-xs text-muted-foreground">Associated products</p>
							</div>

							{/* Total Orders */}
							<div className="space-y-2 flex-1">
								<div className="flex items-center gap-2">
									<div className="p-2 rounded-full bg-muted w-fit">
										<ShoppingCart className="size-4 text-muted-foreground" />
									</div>
									<p className="text-sm font-medium">Total Orders</p>
								</div>
								<div className="font-bold text-2xl">124</div>
								<p className="text-xs text-muted-foreground">This year</p>
							</div>

							{/* Total Spend */}
							<div className="space-y-2 flex-1">
								<div className="flex items-center gap-2">
									<div className="p-2 rounded-full bg-muted w-fit">
										<DollarSign className="size-4 text-muted-foreground" />
									</div>
									<p className="text-sm font-medium">Total Spend</p>
								</div>
								<div className="font-bold text-2xl">₱45,678</div>
								<p className="text-xs text-muted-foreground">Lifetime</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Products Table */}
			<SupplierProductsTable products={supplier.items || []} supplierId={supplierId} />
		</div>
	);
}
