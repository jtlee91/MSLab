import axios, { AxiosError } from "axios";
import type {
  CageGridResponse,
  CageActionResponse,
  RackListResponse,
  ProfessorListResponse,
  AssignRequest,
  ReleaseRequest,
} from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface ApiError {
  status: number;
  message: string;
  isConflict: boolean;
}

function handleApiError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    const status = error.response?.status || 500;
    const message =
      error.response?.data?.detail || error.message || "알 수 없는 오류가 발생했습니다.";
    return {
      status,
      message,
      isConflict: status === 409,
    };
  }
  return {
    status: 500,
    message: "알 수 없는 오류가 발생했습니다.",
    isConflict: false,
  };
}

export const rackApi = {
  async getRacks(): Promise<RackListResponse> {
    const response = await apiClient.get<RackListResponse>("/racks");
    return response.data;
  },
};

export const professorApi = {
  async getProfessors(): Promise<ProfessorListResponse> {
    const response = await apiClient.get<ProfessorListResponse>("/professors");
    return response.data;
  },
};

export const cageApi = {
  async getCageGrid(rackId: number): Promise<CageGridResponse> {
    const response = await apiClient.get<CageGridResponse>(`/cages/rack/${rackId}`);
    return response.data;
  },

  async assignCage(cageId: number, data: AssignRequest): Promise<CageActionResponse> {
    try {
      const response = await apiClient.post<CageActionResponse>(`/cages/${cageId}/assign`, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async releaseCage(cageId: number, data: ReleaseRequest): Promise<CageActionResponse> {
    try {
      const response = await apiClient.post<CageActionResponse>(`/cages/${cageId}/release`, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export type { ApiError as CageApiError };
