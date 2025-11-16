// hooks/useIconMetadata.ts
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
interface Icon {
  name: string;
  tags: string[];
}

interface IconMetadata {
  icons: Icon[];
}

export function useIconMetadata() {
  return useQuery<IconMetadata>({
    queryKey: ["iconMetadata"],
    queryFn: async () => {
      try {
        const response = await axios.get("/api/icons/metadata");
        return response.data;
      } catch (error: unknown) {
        throw new Error(
          error instanceof AxiosError ? error.message : "Failed to fetch data"
        );
      }
    },
  });
}
