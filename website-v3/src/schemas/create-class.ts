import { object, string, number, array } from "yup";

const createClassSchema = object({
  name: string().required(),
  id: number().optional().nullable(),
  people: array().of(number().required().integer()).required(),
});

export default createClassSchema;
