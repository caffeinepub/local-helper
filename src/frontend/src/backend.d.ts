import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Listing {
    id: bigint;
    imageBlob?: ExternalBlob;
    area: string;
    name: string;
    createdAt: bigint;
    ownerPhone: string;
    description: string;
    category: string;
    phone: string;
    price: string;
}
export interface backendInterface {
    addListing(name: string, category: string, price: string, area: string, phone: string, ownerPhone: string, description: string, imageBlob: ExternalBlob | null): Promise<bigint>;
    deleteListing(id: bigint): Promise<boolean>;
    getListing(id: bigint): Promise<Listing | null>;
    getListings(): Promise<Array<Listing>>;
    getListingsByOwner(ownerPhone: string): Promise<Array<Listing>>;
    updateListing(id: bigint, name: string, category: string, price: string, area: string, phone: string, description: string, imageBlob: ExternalBlob | null): Promise<boolean>;
}
