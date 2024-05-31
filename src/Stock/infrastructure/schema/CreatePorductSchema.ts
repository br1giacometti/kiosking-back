import { z } from 'zod';

const CreatePorductSchema = z.object({
  description: z
    .string()
    .max(50, { message: 'must be a description' })
    .optional(),
  sku: z.string().max(50, { message: 'must be a sku code' }).optional(),
  buyPrice: z.number(),
  sellPrice: z.number(),
  minimumQUantity: z.number(),
});
export default CreatePorductSchema;
