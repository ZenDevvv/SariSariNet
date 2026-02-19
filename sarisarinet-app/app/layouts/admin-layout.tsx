import { Suspense } from "react";
import { Outlet } from "react-router";
import { AppSidebar } from "~/components/organisms/app-sidebar";
import { SidebarProvider } from "~/components/ui/sidebar";
import { useAuth } from "~/hooks/use-auth";

export default function AdminLayout() {
	const { isLoading } = useAuth();
	if (isLoading) {
		return <div className="h-screen flex justify-center items-center">Loading...</div>;
	}
	
	return (
		<main className="h-screen bg-sidebar">
			<SidebarProvider>
				<div className="flex h-screen w-full">
					<AppSidebar />

					{/* Right content area */}
					<div className="flex flex-1 flex-col p-4 pl-0">
						<div className="flex flex-1 flex-col rounded-2xl shadow bg-secondary overflow-hidden">
							{/* Scroll wrapper */}
							<div className="flex-1 overflow-y-auto p-6">
								<Suspense fallback={<div>Loading...</div>}>
									<Outlet />
								</Suspense>
							</div>
						</div>
					</div>
				</div>
			</SidebarProvider>
		</main>
	);
}
