import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Time "mo:core/Time";
import Order "mo:core/Order";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  include MixinStorage();

  // Listing type
  type Listing = {
    id : Nat;
    name : Text;
    category : Text;
    price : Text;
    area : Text;
    phone : Text;
    ownerPhone : Text;
    description : Text;
    imageBlob : ?Storage.ExternalBlob;
    createdAt : Int;
  };

  // ListingIdCount type
  type ListingIdCount = {
    count : Nat;
    listing : Listing;
  };

  module ListingIdCount {
    public func compare(a : ListingIdCount, b : ListingIdCount) : Order.Order {
      Nat.compare(a.listing.id, b.listing.id);
    };
  };

  // Persistent data structures
  let listings = Map.empty<Nat, ListingIdCount>();
  var nextId = 0;

  // Add listing function
  public shared ({ caller }) func addListing(
    name : Text,
    category : Text,
    price : Text,
    area : Text,
    phone : Text,
    ownerPhone : Text,
    description : Text,
    imageBlob : ?Storage.ExternalBlob,
  ) : async Nat {
    let id = nextId;
    let createdAt = Time.now();
    let listing : Listing = {
      id;
      name;
      category;
      price;
      area;
      phone;
      ownerPhone;
      description;
      imageBlob;
      createdAt;
    };

    // Determine number of listings for this id
    let count = switch (listings.get(id)) {
      case (null) { 1 };
      case (?{ count }) { count + 1 };
    };

    listings.add(id, { count; listing });
    nextId += 1;
    id;
  };

  // Get all listings
  public query ({ caller }) func getListings() : async [Listing] {
    listings.values().toArray().map(func(l) { l.listing });
  };

  // Get single listing
  public query ({ caller }) func getListing(id : Nat) : async ?Listing {
    switch (listings.get(id)) {
      case (null) { null };
      case (?{ listing }) { ?listing };
    };
  };

  // Update listing (only if it's the first listing with that id)
  public shared ({ caller }) func updateListing(
    id : Nat,
    name : Text,
    category : Text,
    price : Text,
    area : Text,
    phone : Text,
    description : Text,
    imageBlob : ?Storage.ExternalBlob,
  ) : async Bool {
    switch (listings.get(id)) {
      case (null) { false };
      case (?{ count; listing }) {
        if (count > 1) {
          Runtime.trap("This listing already exists multiple times and cannot be updated");
        };

        let updatedListing : Listing = {
          id;
          name;
          category;
          price;
          area;
          phone;
          ownerPhone = listing.ownerPhone;
          description;
          imageBlob;
          createdAt = listing.createdAt;
        };

        listings.add(id, { count; listing = updatedListing });
        true;
      };
    };
  };

  // Delete the most recently added listing with given id
  public shared ({ caller }) func deleteListing(id : Nat) : async Bool {
    switch (listings.get(id)) {
      case (null) { false };
      case (?{ count; listing }) {
        if (count > 1) {
          listings.add(id, { count = count - 1; listing });
        } else {
          listings.remove(id);
        };
        true;
      };
    };
  };

  // Get listings by owner phone (all listings with at least one match)
  public query ({ caller }) func getListingsByOwner(ownerPhone : Text) : async [Listing] {
    let uniqueIds = List.empty<Nat>();
    let allListings = listings.values().toArray().reverse();

    let matchingListings = allListings.filter(
      func(l) {
        l.listing.ownerPhone == ownerPhone and not uniqueIds.toArray().any(
          func(id) {
            id == l.listing.id;
          }
        );
      }
    );

    matchingListings.map(func(l) { l.listing });
  };
};
