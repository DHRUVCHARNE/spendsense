"use server";

import { formDataToNestedObject } from "@/lib/formDataUtils";
import { revalidatePath } from "next/cache";
import { z } from "zod";

type ActionResult<R=unknown> = {
  ok: boolean;
  message?: string;
  data?:R;
};

export async function handleAction<T, R>(
  formData: FormData,
  schema: z.ZodType<T>,
  handler: (data: T) => Promise<R>,
  options?: {
    revalidate?: string | string[];
    invalidMessage?: string;
    errorMessage?: string;
  }
): Promise<ActionResult<R>> {
  const raw = formDataToNestedObject(formData);
  console.log("raw: ",raw);
  const parsed = schema.safeParse(raw);

  if (!parsed.success) {
    console.error(z.treeifyError(parsed.error));
    return {
      ok: false,
      message: options?.invalidMessage ?? "Invalid form data",
    };
  }

  try {
    const res=await handler(parsed.data);

    if (options?.revalidate) {
      const paths = Array.isArray(options.revalidate)
        ? options.revalidate
        : [options.revalidate];

      paths.forEach((p) => revalidatePath(p));
    }

    return { ok: true, data:res };
  } catch (err) {
    console.error("Server Action Error:", err);
    return {
      ok: false,
      message: options?.errorMessage ?? "Something went wrong",
    };
  }
}
