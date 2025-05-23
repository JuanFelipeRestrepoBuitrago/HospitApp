import CONTAINER from "@/adapters/container";
import IpsServiceAdapter from "@/adapters/services/ips.service.adapter";
import { TYPES } from "@/adapters/types";
import { IpsResponse } from "@/models/ips.interface";
import { ReviewResponse } from "@/models/review.interface";
import { SortCriteria } from "@/repositories/review_mongo.repository.interfaces";

export const getIpsProps = async (params: {
	name: string;
}): Promise<IpsResponse | null> => {
	try {
		// Inject the dependencies

		const IPS_SERVICE = CONTAINER.get<IpsServiceAdapter>(
			TYPES.IpsServiceAdapter
		);

		// Fetch the data
		const IPS = await IPS_SERVICE.getIpsByName(params.name);

		return IPS;
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		} else {
			throw new Error("Error fetching page props");
		}
	}
};

export const getIpsPropsWithReviewsPagination = async (params: {
	name: string;
	reviewsPage: number;
	reviewsPageSize: number;
	sorts?: SortCriteria[];
	ratingFilter?: number;
}): Promise<{
	ips: IpsResponse | null;
	reviewsResult: { reviews: ReviewResponse[]; total: number };
}> => {
	try {
		// Inject the dependencies

		const IPS_SERVICE = CONTAINER.get<IpsServiceAdapter>(
			TYPES.IpsServiceAdapter
		);

		// Fetch the data
		const RESULT = await IPS_SERVICE.getIpsByNameWithReviewsPagination(
			params.name,
			params.reviewsPage,
			params.reviewsPageSize,
			params.sorts,
			params.ratingFilter
		);

		return RESULT;
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		} else {
			throw new Error("Error fetching page props");
		}
	}
};

export const getIpsPropsWithReviews = async (params: {
	name: string;
	sorts?: SortCriteria[];
	ratingFilter?: number;
}): Promise<{
	ips: IpsResponse | null;
	reviewsResult: ReviewResponse[];
}> => {
	try {
		// Inject the dependencies

		const IPS_SERVICE = CONTAINER.get<IpsServiceAdapter>(
			TYPES.IpsServiceAdapter
		);

		// Fetch the data
		return await IPS_SERVICE.getIpsByNameWithReviews(
			params.name,
			params.sorts,
			params.ratingFilter
		);
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		} else {
			throw new Error("Error fetching page props");
		}
	}
};
