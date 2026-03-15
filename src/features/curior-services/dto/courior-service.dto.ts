import type { CouriorService } from "../types/courior-service.types";
export type { RegisterAdminPayload, RegisterAdminResponse } from "@/features/admin/dto/admin.dto";

export type CreateCourierServiceRequestPayload = {
  serviceName: string;
  phone1?: string;
  phone2?: string;
  directorName?: string;
  directorEmail?: string;
  directorPhone?: string;
  address?: string;
};

export type CreateCourierServiceRequestResponse = {
  message: string;
  data: CouriorService;
};

export type CreateCourierServiceApiResponse = {
  message?: string;
  data?: CouriorService;
  error?: string;
};

const clean = (value?: string) => value?.trim();

export const toCreateCourierServiceDto = (
  payload: CreateCourierServiceRequestPayload
): CreateCourierServiceRequestPayload => {
  const dto = {
    serviceName: clean(payload.serviceName) ?? "",
    phone1: clean(payload.phone1),
    phone2: clean(payload.phone2),
    directorName: clean(payload.directorName),
    directorEmail: clean(payload.directorEmail),
    directorPhone: clean(payload.directorPhone),
    address: clean(payload.address),
  };

  return Object.fromEntries(
    Object.entries(dto).filter(([, value]) => value !== undefined && value !== "")
  ) as CreateCourierServiceRequestPayload;
};
