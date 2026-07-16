import { z } from "zod";

const ESTADOS = ["pendiente", "seguimiento", "completado"];

export const taskCreateSchema = z.object({
  title: z.string().trim().min(1),
  responsable: z.string().trim().min(1),
  fecha: z.string().trim().min(1).default("Por definir"),
  estado: z.enum(ESTADOS).default("pendiente"),
  minutaId: z.number().int().positive().nullable().optional(),
});

export const taskUpdateSchema = z.object({
  title: z.string().trim().min(1).optional(),
  responsable: z.string().trim().min(1).optional(),
  fecha: z.string().trim().min(1).optional(),
  estado: z.enum(ESTADOS).optional(),
  minutaId: z.number().int().positive().nullable().optional(),
});
