// 'use server';

// import { z } from 'zod';
// import { topicFormSchema } from '../lib/schemas/topicFormSchema';
// type Inputs = z.infer<typeof topicFormSchema>;

// export async function addEntry(data: Inputs) {
//   const result = topicFormSchema.safeParse(data);

//   if (result.success) {
//     return { success: true, data: result.data };
//   }

//   if (result.error) {
//     return { success: false, error: result.error.format() };
//   }
// }
