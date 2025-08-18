import type { Listing, Preset } from "@/lib/types";

export const samplePresets: Preset[] = [
  {
    id: "preset-1",
    name: "Kitchen Slow Dolly",
    angle: "Eye",
    shot: "Dolly",
    speed: "Slow",
    durationSec: 10,
  },
  {
    id: "preset-2",
    name: "Living Room High Pan",
    angle: "High",
    shot: "Pan",
    speed: "Very Slow",
    durationSec: 12,
  },
  {
    id: "preset-3",
    name: "Bedroom Eye Zoom",
    angle: "Eye",
    shot: "Zoom",
    speed: "Slow",
    durationSec: 8,
  },
  {
    id: "preset-4",
    name: "Bathroom Low Tilt",
    angle: "Low",
    shot: "Tilt",
    speed: "Very Slow",
    durationSec: 15,
  },
];

export const sampleListings: Listing[] = [
  {
    id: "listing-1",
    source: "zillow",
    url: "https://zillow.com/homedetails/123-main-st",
    address: "123 Main Street",
    city: "Austin",
    state: "TX",
    photos: [
      {
        id: "photo-1",
        src: "/sample-assets/images/kitchen-1.jpg",
        orientation: "H",
        tag: "Interior",
        room: "kitchen",
      },
      {
        id: "photo-2",
        src: "/sample-assets/images/living-room-1.jpg",
        orientation: "H",
        tag: "Interior",
        room: "living_room",
      },
      {
        id: "photo-3",
        src: "/sample-assets/images/bedroom-1.jpg",
        orientation: "H",
        tag: "Interior",
        room: "bedroom",
      },
      {
        id: "photo-4",
        src: "/sample-assets/images/bathroom-1.jpg",
        orientation: "H",
        tag: "Interior",
        room: "bathroom",
      },
      {
        id: "photo-5",
        src: "/sample-assets/images/exterior-1.jpg",
        orientation: "H",
        tag: "Exterior",
      },
      {
        id: "photo-6",
        src: "/sample-assets/images/kitchen-2.jpg",
        orientation: "V",
        tag: "Interior",
        room: "kitchen",
      },
      {
        id: "photo-7",
        src: "/sample-assets/images/living-room-2.jpg",
        orientation: "V",
        tag: "Interior",
        room: "living_room",
      },
      {
        id: "photo-8",
        src: "/sample-assets/images/bedroom-2.jpg",
        orientation: "V",
        tag: "Interior",
        room: "bedroom",
      },
    ],
  },
  {
    id: "listing-2",
    source: "redfin",
    url: "https://redfin.com/house/456-oak-ave",
    address: "456 Oak Avenue",
    city: "Austin",
    state: "TX",
    photos: [
      {
        id: "photo-9",
        src: "/sample-assets/images/kitchen-3.jpg",
        orientation: "H",
        tag: "Interior",
        room: "kitchen",
      },
      {
        id: "photo-10",
        src: "/sample-assets/images/living-room-3.jpg",
        orientation: "H",
        tag: "Interior",
        room: "living_room",
      },
      {
        id: "photo-11",
        src: "/sample-assets/images/bedroom-3.jpg",
        orientation: "H",
        tag: "Interior",
        room: "bedroom",
      },
      {
        id: "photo-12",
        src: "/sample-assets/images/exterior-2.jpg",
        orientation: "H",
        tag: "Exterior",
      },
    ],
  },
];

export function getListingById(id: string): Listing | undefined {
  return sampleListings.find(listing => listing.id === id);
}

export function getAllListings(): Listing[] {
  return sampleListings;
}

export function getPresets(): Preset[] {
  return samplePresets;
}
