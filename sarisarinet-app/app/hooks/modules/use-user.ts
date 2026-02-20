import { useMutation, useQuery } from "@tanstack/react-query";
import type { ApiQueryParams } from "~/services/api-service";
import { queryClient } from "~/lib/query-client";
import userService from "~/services/modules/user-service";
import type { CreateUser, UpdateUser } from "~/zod/modules/user.zod";

export const useGetUsers = (apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["users", apiParams],
		queryFn: () => {
			return userService
				.select(apiParams?.fields || "")
				.search(apiParams?.query || "")
				.paginate(apiParams?.page || 1, apiParams?.limit || 10)
				.sort(apiParams?.sort, apiParams?.order)
				.filter(apiParams?.filter || "")
				.getAllUsers();
		},
	});
};

export const useGetUserById = (userId: string, apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["user-by-id", userId, apiParams],
		queryFn: () => {
			return userService
				.select(apiParams?.fields || "")
				.getUserById(userId);
		},
		enabled: !!userId,
	});
};

export const useCreateUser = () => {
	return useMutation({
		mutationFn: (data: CreateUser | FormData) => {
			return userService.createUser(data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] });
		},
	});
};

export const useUpdateUser = () => {
	return useMutation({
		mutationFn: ({ userId, data }: { userId: string; data: UpdateUser | FormData }) => {
			return userService.updateUser(userId, data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] });
		},
	});
};

export const useDeleteUser = () => {
	return useMutation({
		mutationFn: (userId: string) => {
			return userService.deleteUser(userId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] });
		},
	});
};
