import { Outlet } from "react-router";

const AuthLayout = () => {
	return (
		<main className="min-h-screen bg-secondary">
			<Outlet />
		</main>
	);
};

export default AuthLayout;
