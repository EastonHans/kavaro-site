type SafeFetchResponse<T> = {
  data?: T;
  error?: string;
};

export async function safeFetch<T>(
  url: string,
  options?: RequestInit,
): Promise<SafeFetchResponse<T>> {
  try {
    const res = await fetch(url, options);

    const data = await res.json();

    if (!res.ok) {
      return {
        error: data?.message || "Request failed",
      };
    }

    return {
      data: data as T,
    };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Network error",
    };
  }
}
