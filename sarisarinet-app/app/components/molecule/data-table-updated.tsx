import { ArrowUpIcon, ArrowDownIcon, SearchIcon, XIcon, Funnel } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

export type SortDirection = "asc" | "desc" | null;

export interface ColumnFilter {
	key?: string;
	value: string;
	label: string;
}

export interface DataTableColumn<T> {
	key: keyof T;
	label: string;
	sortable?: boolean;
	filterable?: boolean;
	filterOptions?: ColumnFilter[];
	searchable?: boolean;
	render?: (value: T[keyof T], row: T) => React.ReactNode;
}

export interface DataTableProps<T> {
	columns: DataTableColumn<T>[];
	data: T[];
	className?: string;
	onRowClick?: (row: T) => void;
}

interface ColumnState {
	sortDirection: SortDirection;
	selectedFilters: string[];
}

export function DataTable<T extends Record<string, any>>({
	columns,
	data,
	className,
	onRowClick,
}: DataTableProps<T>) {
	const [searchParams, setSearchParams] = useSearchParams();
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const [searchQuery, setSearchQuery] = useState(() => searchParams.get("search") || "");

	// Helper function to extract selected filters for a column from URL params
	const getSelectedFiltersForColumn = (
		col: DataTableColumn<T>,
		filterMap: Map<string, string[]>,
	): string[] => {
		const colKey = String(col.key);
		const selectedFilters: string[] = [];

		// Check if column has filter options with custom keys
		if (col.filterOptions) {
			col.filterOptions.forEach((option) => {
				const filterKey = option.key || colKey;
				const valuesForKey = filterMap.get(filterKey) || [];
				if (valuesForKey.includes(option.value)) {
					selectedFilters.push(option.value);
				}
			});
		} else {
			// No filter options, just use the column key
			return filterMap.get(colKey) || [];
		}

		return selectedFilters;
	};

	const [columnStates, setColumnStates] = useState<Record<string, ColumnState>>(() => {
		const initialState: Record<string, ColumnState> = {};
		const sortKeyParam = searchParams.get("sort");
		const orderParam = searchParams.get("order");
		const filterParam = searchParams.get("filter") || "";
		const filterPairs = filterParam.split(",").filter((p) => p.includes(":"));
		const filterMap = new Map<string, string[]>();
		filterPairs.forEach((pair) => {
			const parts = pair.split(":", 2);
			if (parts.length === 2) {
				const [key, val] = parts;
				if (!filterMap.has(key)) {
					filterMap.set(key, []);
				}
				filterMap.get(key)!.push(val);
			}
		});
		columns.forEach((col) => {
			const key = String(col.key);
			const sortDirection: SortDirection =
				sortKeyParam === key && (orderParam === "asc" || orderParam === "desc")
					? (orderParam as SortDirection)
					: null;
			initialState[key] = {
				sortDirection,
				selectedFilters: getSelectedFiltersForColumn(col, filterMap),
			};
		});
		return initialState;
	});

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	useEffect(() => {
		const newSearchQuery = searchParams.get("search") || "";
		setSearchQuery(newSearchQuery);
		const sortKeyParam = searchParams.get("sort");
		const orderParam = searchParams.get("order");
		const filterParam = searchParams.get("filter") || "";
		const filterPairs = filterParam.split(",").filter((p) => p.includes(":"));
		const filterMap = new Map<string, string[]>();
		filterPairs.forEach((pair) => {
			const parts = pair.split(":", 2);
			if (parts.length === 2) {
				const [key, val] = parts;
				if (!filterMap.has(key)) {
					filterMap.set(key, []);
				}
				filterMap.get(key)!.push(val);
			}
		});
		setColumnStates((prev) => {
			const newState: Record<string, ColumnState> = {};
			columns.forEach((col) => {
				const key = String(col.key);
				const sortDir: SortDirection =
					sortKeyParam === key && (orderParam === "asc" || orderParam === "desc")
						? (orderParam as SortDirection)
						: null;
				newState[key] = {
					...prev[key],
					sortDirection: sortDir,
					selectedFilters: getSelectedFiltersForColumn(col, filterMap),
				};
			});
			return newState;
		});
	}, [searchParams, columns]);

	const handleSortClick = (columnKey: string, direction: "asc" | "desc") => {
		setColumnStates((prev) => {
			const newState = { ...prev };
			Object.keys(newState).forEach((key) => {
				newState[key].sortDirection = null;
			});
			newState[columnKey].sortDirection = direction;
			return newState;
		});
		setSearchParams((prev) => {
			const newParams = new URLSearchParams(prev);
			newParams.set("sort", columnKey);
			newParams.set("order", direction);
			return newParams;
		});
	};

	const handleFilterChange = (columnKey: string, value: string, checked: boolean) => {
		setColumnStates((prev) => {
			const newState = { ...prev };
			const currentFilters = newState[columnKey].selectedFilters;
			let newFilters: string[];
			if (checked) {
				newFilters = currentFilters.includes(value)
					? currentFilters
					: [...currentFilters, value];
			} else {
				newFilters = currentFilters.filter((v) => v !== value);
			}
			newState[columnKey].selectedFilters = newFilters;
			const filterParts: string[] = [];
			columns.forEach((col) => {
				const colKey = String(col.key);
				newState[colKey].selectedFilters.forEach((v) => {
					// Find the filter option to check if it has a custom key
					const filterOption = col.filterOptions?.find((opt) => opt.value === v);
					const filterKey = filterOption?.key || colKey;
					filterParts.push(`${filterKey}:${v}`);
				});
			});
			const newFilterValue = filterParts.length > 0 ? filterParts.join(",") : null;
			setSearchParams((currentParams) => {
				const newParams = new URLSearchParams(currentParams);
				if (newFilterValue) {
					newParams.set("filter", newFilterValue);
				} else {
					newParams.delete("filter");
				}
				return newParams;
			});
			return newState;
		});
	};

	const handleClearFilters = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
		setColumnStates((prev) => {
			const newState = { ...prev };
			Object.keys(newState).forEach((key) => {
				newState[key].sortDirection = null;
				newState[key].selectedFilters = [];
			});
			return newState;
		});
		setSearchQuery("");
		setSearchParams((prev) => {
			const newParams = new URLSearchParams(prev);
			newParams.delete("sort");
			newParams.delete("order");
			newParams.delete("search");
			newParams.delete("filter");
			return newParams;
		});
	};

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchQuery(value);

		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		timeoutRef.current = setTimeout(() => {
			setSearchParams((prev) => {
				const newParams = new URLSearchParams(prev);
				if (value) {
					newParams.set("search", value);
				} else {
					newParams.delete("search");
				}
				return newParams;
			});
		}, 500);
	};

	const filteredAndSortedData = data;

	return (
		<div className={cn("w-full overflow-auto p-1", className)}>
			<table className="w-full border-collapse">
				<thead>
					<tr className="border-b border-border bg-gray-100">
						{columns.map((column) => {
							const state = columnStates[String(column.key)];
							const hasActiveSortOrFilter =
								state?.sortDirection !== null || state?.selectedFilters.length > 0;
							const hasActiveSearch = !!searchQuery;
							const hasActiveState =
								hasActiveSortOrFilter || (column.searchable && hasActiveSearch);

							const hasFeatures =
								column.sortable ||
								column.searchable ||
								(column.filterable && (column.filterOptions?.length ?? 0));

							if (!hasFeatures) {
								return (
									<th
										key={String(column.key)}
										className="text-left p-0 font-medium">
										<div className="h-12 w-full px-4 flex items-center font-medium text-foreground text-sm">
											{column.label}
										</div>
									</th>
								);
							}

							return (
								<th key={String(column.key)} className="text-left p-0 font-medium">
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant="ghost"
												className={cn(
													"relative h-12 w-full justify-between !gap-1 !px-4 font-medium hover:text-foreground hover:bg-gray-200 cursor-pointer group",
													hasActiveState &&
														"text-primary underline hover:text-primary",
												)}>
												<span className="flex items-center gap-2">
													{column.label}
												</span>
												<Funnel
													className={`hidden group-hover:flex absolute right-4 ${hasActiveState && "text-primary flex"}`}
												/>
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent
											align="start"
											className="w-56 bg-popover">
											{column.sortable && (
												<>
													<DropdownMenuItem
														className={cn(
															"cursor-pointer",
															state?.sortDirection === "asc" &&
																"text-primary",
														)}
														onClick={() =>
															handleSortClick(
																String(column.key),
																"asc",
															)
														}>
														<ArrowUpIcon
															className={cn(
																"mr-2 h-4 w-4",
																state?.sortDirection === "asc" &&
																	"text-primary",
															)}
														/>
														Sort Ascending
													</DropdownMenuItem>
													<DropdownMenuItem
														className={cn(
															"cursor-pointer",
															state?.sortDirection === "desc" &&
																"text-primary",
														)}
														onClick={() =>
															handleSortClick(
																String(column.key),
																"desc",
															)
														}>
														<ArrowDownIcon
															className={cn(
																"mr-2 h-4 w-4",
																state?.sortDirection === "desc" &&
																	"text-primary",
															)}
														/>
														Sort Descending
													</DropdownMenuItem>
												</>
											)}
											{column.sortable &&
												(column.searchable ||
													(column.filterable &&
														(column.filterOptions?.length ?? 0) >
															0)) && <DropdownMenuSeparator />}

											{column.searchable && (
												<>
													<div className="p-2">
														<div className="relative">
															<SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
															<Input
																placeholder={`Search ${column.label.toLowerCase()}...`}
																value={searchQuery}
																className="pl-8 h-9 bg-background"
																onChange={handleSearchChange}
																onClick={(e) => e.stopPropagation()}
															/>
														</div>
													</div>
												</>
											)}

											{column.searchable &&
												column.filterable &&
												(column.filterOptions?.length ?? 0) && (
													<DropdownMenuSeparator />
												)}

											{column.filterable &&
												column.filterOptions &&
												column.filterOptions.length > 0 && (
													<>
														<div className="p-2 max-h-48 overflow-y-auto">
															<div className="text-xs font-medium text-muted-foreground mb-2 px-2">
																Filter Options
															</div>
															{column.filterOptions.map((option) => {
																const checked =
																	state?.selectedFilters.includes(
																		option.value,
																	) || false;
																return (
																	<div
																		key={option.value}
																		className="flex items-center space-x-2 px-2 py-1.5 hover:bg-accent rounded-sm cursor-pointer"
																		onClick={() =>
																			handleFilterChange(
																				String(column.key),
																				option.value,
																				!checked,
																			)
																		}>
																		<Checkbox
																			checked={checked}
																			onCheckedChange={(
																				checked,
																			) =>
																				handleFilterChange(
																					String(
																						column.key,
																					),
																					option.value,
																					!!checked,
																				)
																			}
																		/>
																		<span className="text-sm">
																			{option.label}
																		</span>
																	</div>
																);
															})}
														</div>
													</>
												)}

											{hasActiveState &&
												(column.sortable ||
													column.searchable ||
													(column.filterable &&
														(column.filterOptions?.length ?? 0))) && (
													<DropdownMenuSeparator />
												)}

											{hasActiveState && (
												<DropdownMenuItem
													className="cursor-pointer text-destructive focus:text-destructive"
													onClick={handleClearFilters}>
													<XIcon className="mr-2 h-4 w-4" />
													Clear Filters
												</DropdownMenuItem>
											)}
										</DropdownMenuContent>
									</DropdownMenu>
								</th>
							);
						})}
					</tr>
				</thead>
				<tbody>
					{filteredAndSortedData.map((row, rowIndex) => (
						<tr
							key={rowIndex}
							className={cn(
								"border-b border-border hover:bg-secondary/80 transition-colors",
								onRowClick && "cursor-pointer",
							)}
							onClick={() => onRowClick?.(row)}>
							{columns.map((column) => (
								<td key={String(column.key)} className="px-4 py-2 text-sm">
									{column.render
										? column.render(row[column.key], row)
										: String(row[column.key] || "")}
								</td>
							))}
						</tr>
					))}
					{filteredAndSortedData.length === 0 && (
						<tr>
							<td
								colSpan={columns.length}
								className="px-4 py-8 text-center text-muted-foreground">
								No results found
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
}
