import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import osparLogo from "@/assets/images/ospar.jpg";
import { useAuth } from "~/hooks/use-auth";
import { useNavigate } from "react-router";
import { PAGE_TITLES } from "~/configs/page-titles";
import type { Route } from "./+types/login";

export function meta({}: Route.MetaArgs) {
	return [{ title: PAGE_TITLES.login }];
}

export default function LoginPage() {
	const { login, error } = useAuth();

	const [identifier, setIdentifier] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const user = await login(identifier, password);
			if (user) {
				await new Promise((resolve) => setTimeout(resolve, 1000));
				navigate("/");
			}
		} catch (err) {
			// Error is handled by the hook, but you can add additional handling here if needed
			console.error("Login failed:", err);
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
			<div className="w-full max-w-md">
				{/* Logo and Branding */}
				<div className="flex flex-col items-center mb-8">
					<div className="flex flex-col items-center gap-3 mb-4">
						<img
							src={osparLogo}
							alt="Ospital ng Parañaque Logo"
							className="w-24 h-24 object-contain rounded-full shadow-md"
						/>
						<div className="text-center">
							<h1 className="text-2xl font-bold text-foreground">OSPAR</h1>
							<p className="text-sm text-muted-foreground">
								Inventory Management System
							</p>
						</div>
					</div>
				</div>

				{/* Login Card */}
				<Card className="border-border shadow-lg">
					<CardHeader className="space-y-1">
						<CardTitle className="text-2xl font-bold text-center">
							Welcome back
						</CardTitle>
						<CardDescription className="text-center">
							Sign in to your PPP office account
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="identifier">Email or username</Label>
								<Input
									id="identifier"
									type="text"
									value={identifier}
									onChange={(e) => setIdentifier(e.target.value)}
									className="h-11"
									disabled={isLoading}
									placeholder="Enter email or username"
								/>
							</div>

							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<Label htmlFor="password">Password</Label>
									<button
										type="button"
										className="text-xs text-primary hover:underline"
										onClick={() => console.log("Forgot password clicked")}
										disabled={isLoading}>
										Forgot password?
									</button>
								</div>
								<div className="relative">
									<Input
										id="password"
										type={showPassword ? "text" : "password"}
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										className="h-11 pr-10"
										disabled={isLoading}
										placeholder="Enter password"
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
										disabled={isLoading}>
										{showPassword ? (
											<EyeOff className="w-4 h-4" />
										) : (
											<Eye className="w-4 h-4" />
										)}
									</button>
								</div>
							</div>

							{error && (
								<div className="text-sm text-destructive text-center">{error}</div>
							)}

							<Button
								type="submit"
								className="w-full h-11 font-medium cursor-pointer"
								disabled={isLoading}>
								{isLoading ? "Signing in..." : "Sign in"}
							</Button>
						</form>

						<div className="mt-6 text-center text-sm text-muted-foreground">
							<p>Need access? Contact your system administrator</p>
						</div>
					</CardContent>
				</Card>

				{/* Footer */}
				<div className="mt-8 text-center text-xs text-muted-foreground">
					<p className="mt-1">
						Powered by <span className="font-semibold">Uzaro Solutions Tech Inc</span>
					</p>
				</div>
			</div>
		</div>
	);
}
