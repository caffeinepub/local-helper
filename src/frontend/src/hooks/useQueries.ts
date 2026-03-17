import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ExternalBlob } from "../backend";
import type { Listing } from "../backend.d";
import { useActor } from "./useActor";

export function useListings() {
  const { actor, isFetching } = useActor();
  return useQuery<Listing[]>({
    queryKey: ["listings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getListings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useListing(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Listing | null>({
    queryKey: ["listing", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getListing(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useListingsByOwner(ownerPhone: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Listing[]>({
    queryKey: ["listingsByOwner", ownerPhone],
    queryFn: async () => {
      if (!actor || !ownerPhone) return [];
      return actor.getListingsByOwner(ownerPhone);
    },
    enabled: !!actor && !isFetching && !!ownerPhone,
  });
}

export function useAddListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      category: string;
      price: string;
      area: string;
      phone: string;
      ownerPhone: string;
      description: string;
      imageBlob: ExternalBlob | null;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addListing(
        data.name,
        data.category,
        data.price,
        data.area,
        data.phone,
        data.ownerPhone,
        data.description,
        data.imageBlob,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
  });
}

export function useUpdateListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      name: string;
      category: string;
      price: string;
      area: string;
      phone: string;
      description: string;
      imageBlob: ExternalBlob | null;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateListing(
        data.id,
        data.name,
        data.category,
        data.price,
        data.area,
        data.phone,
        data.description,
        data.imageBlob,
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({
        queryKey: ["listing", variables.id.toString()],
      });
    },
  });
}

export function useDeleteListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteListing(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["listingsByOwner"] });
    },
  });
}
