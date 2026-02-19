import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable, type DataTableColumn } from "~/components/molecule/data-table-updated";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { UpsertSupplierForm } from "~/components/forms/upsert-supplier-form";
import { useCreateSupplier, useGetSuppliers } from "~/hooks/use-supplier";
import { useNavigate, useSearchParams } from "react-router";
import type { Supplier, CreateSupplier, SupplierWithRelation } from "~/zod/supplier.zod";
import { toast } from "sonner";
import { TableSkeleton } from "~/components/skeletons/table-skeleton";
import { Users, CheckCircle, XCircle, ShoppingCart } from "lucide-react";
import { useMemo } from "react";
import { useApiParams } from "~/hooks/util-hooks/use-api-params";
import { PAGE_TITLES } from "~/configs/page-titles";
import type { Route } from "./+types/supplier";

export function meta({}: Route.MetaArgs) {
	return [{ title: PAGE_TITLES.suppliers }];
}

export default function Supplier() {
	const [searchParams, setSearchParams] = useSearchParams();
	const action = searchParams.get("action");
	const isOpen = action === "create";

	const { apiParams, searchTerm, handleSearchChange } = useApiParams({
		fields: "id,name,code,contactPerson,email,phone,isActive,address",
		sort: "createdAt",
	});

	const { data: suppliers, isLoading: isSuppliersLoading } = useGetSuppliers(apiParams);
	const navigate = useNavigate();
	const createSupplier = useCreateSupplier();

	const columns: DataTableColumn<SupplierWithRelation>[] = [
		{
			key: "code",
			label: "Code",
			sortable: true,
			render: (value) => <div className="font-mono py-2">{String(value)}</div>,
		},
		{
			key: "name",
			label: "Supplier Name",
			sortable: true,
			render: (value) => <span className="font-medium">{String(value)}</span>,
		},
		{
			key: "contactPerson",
			label: "Contact Person",
			sortable: true,
		},
		{
			key: "email",
			label: "Email",
			sortable: true,
			render: (value) => <span className="font-mono text-sm">{String(value)}</span>,
		},
		{
			key: "isActive",
			label: "Status",
			sortable: true,
			filterable: true,
			filterOptions: [
				{ value: "true", label: "Active" },
				{ value: "false", label: "Inactive" },
			],
			render: (_, row) => (
				<Badge variant={row.isActive ? "default" : "secondary"}>
					{row.isActive ? "Active" : "Inactive"}
				</Badge>
			),
		},
	];

	const handleFormSubmit = async (data: CreateSupplier) => {
		const mutationPromise = createSupplier.mutateAsync(data);

		try {
			await toast.promise(mutationPromise, {
				loading: "Creating Supplier...",
				success: () => ({
					message: "Supplier Created",
				}),
				error: () => ({
					message: "Supplier Creation Failed",
				}),
			});
			setSearchParams({});
		} catch (error) {
			console.error(error);
		}
	};

	const handleCancel = () => {
		setSearchParams({});
	};

	const handleRowClick = (row: SupplierWithRelation) => {
		navigate(`/suppliers/${row.id}`);
	};

	const stats = useMemo(() => {
		const totalSuppliers = suppliers?.suppliers.length ?? 0;
		const activeSuppliers = suppliers?.suppliers.filter((s) => s.isActive).length ?? 0;
		const inactiveSuppliers = suppliers?.suppliers.filter((s) => !s.isActive).length ?? 0;

		return [
			{
				title: "Total Suppliers",
				icon: Users,
				value: totalSuppliers,
				description: { subtitleText: "All suppliers" },
			},
			{
				title: "Active Suppliers",
				icon: CheckCircle,
				value: activeSuppliers,
				iconClass: "text-success",
				description: { subtitleText: "Currently active" },
			},
			{
				title: "Inactive Suppliers",
				icon: XCircle,
				value: inactiveSuppliers,
				iconClass: "text-destructive",
				description: { subtitleText: "On hold" },
			},
			{
				title: "Total Orders",
				icon: ShoppingCart,
				value: "124",
				description: { subtitleText: "This year" },
			},
		];
	}, [suppliers]);

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-semibold text-3xl text-balance">Supplier Management</h1>
					<p className="text-muted-foreground">Manage your suppliers and their details</p>
				</div>
			</div>

			<Card>
				<CardHeader>
					<div className="flex justify-between items-center">
						<CardTitle>Suppliers List</CardTitle>
						<div className="flex items-center gap-2">
							<Input
								value={searchTerm}
								onChange={handleSearchChange}
								placeholder="Search suppliers..."
								className="w-[300px]"
							/>
							<Button onClick={() => setSearchParams({ action: "create" })}>
								<Plus className="mr-2 size-4" />
								Add Supplier
							</Button>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					{isSuppliersLoading ? (
						<TableSkeleton
							rows={5}
							colWidths={["w-[15%]", "w-[25%]", "w-[20%]", "w-[25%]", "w-[15%]"]}
						/>
					) : (
						<DataTable
							columns={columns}
							data={suppliers?.suppliers || []}
							onRowClick={handleRowClick}
						/>
					)}
				</CardContent>
			</Card>

			<Dialog
				open={isOpen}
				onOpenChange={(open) => {
					if (!open) {
						setSearchParams({});
					}
				}}>
				<DialogContent className="sm:max-w-2xl">
					<DialogHeader>
						<DialogTitle>Add New Supplier</DialogTitle>
						<DialogDescription>Enter supplier details below.</DialogDescription>
					</DialogHeader>
					<UpsertSupplierForm onSubmit={handleFormSubmit} onCancel={handleCancel} />
				</DialogContent>
			</Dialog>
		</div>
	);
}
