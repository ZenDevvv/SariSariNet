import { useNavigate } from "react-router";
import type { Route } from "./+types/landing";
import { useAuth } from "~/hooks/use-auth";

import { PAGE_TITLES } from "~/configs/page-titles";

export function meta({}: Route.MetaArgs) {
	return [{ title: PAGE_TITLES.landing }];
}

export default function LandingPage() {
	const navigate = useNavigate();
	const { user } = useAuth();

	return <div className="flex flex-col min-h-screen"></div>;
}
