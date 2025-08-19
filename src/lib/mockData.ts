import type { Template } from "./types";

export const mockTemplates: Template[] = [
  {
    id: "template-1",
    name: "Cinematic Real Estate",
    thumbnail: "/sample-assets/images/living-room-01.jpg",
    duration: 15,
    shots: 3,
    format: "16:9",
    style: "Cinematic",
    credits: 5,
    isNew: true,
    rating: 4.8,
    usageCount: 1247
  },
  {
    id: "template-2",
    name: "Kitchen Elegance",
    thumbnail: "/sample-assets/images/kitchen-01.jpg",
    duration: 12,
    shots: 2,
    format: "16:9",
    style: "Commercial",
    credits: 3,
    rating: 4.6,
    usageCount: 892
  },
  {
    id: "template-3",
    name: "Bedroom Serenity",
    thumbnail: "/sample-assets/images/bedroom-01.jpg",
    duration: 10,
    shots: 2,
    format: "9:16",
    style: "Artistic",
    credits: 4,
    rating: 4.9,
    usageCount: 567
  },
  {
    id: "template-4",
    name: "Living Space Flow",
    thumbnail: "/sample-assets/images/living-room-01.jpg",
    duration: 18,
    shots: 4,
    format: "16:9",
    style: "Documentary",
    credits: 6,
    rating: 4.7,
    usageCount: 2341
  },
  {
    id: "template-5",
    name: "Modern Kitchen",
    thumbnail: "/sample-assets/images/kitchen-01.jpg",
    duration: 14,
    shots: 3,
    format: "4:3",
    style: "Corporate",
    credits: 4,
    rating: 4.5,
    usageCount: 756
  },
  {
    id: "template-6",
    name: "Master Suite",
    thumbnail: "/sample-assets/images/bedroom-01.jpg",
    duration: 16,
    shots: 3,
    format: "16:9",
    style: "Cinematic",
    credits: 5,
    rating: 4.8,
    usageCount: 1103
  },
  {
    id: "template-7",
    name: "Open Concept",
    thumbnail: "/sample-assets/images/living-room-01.jpg",
    duration: 20,
    shots: 5,
    format: "16:9",
    style: "Documentary",
    credits: 8,
    rating: 4.9,
    usageCount: 1892
  },
  {
    id: "template-8",
    name: "Gourmet Kitchen",
    thumbnail: "/sample-assets/images/kitchen-01.jpg",
    duration: 13,
    shots: 2,
    format: "9:16",
    style: "Commercial",
    credits: 3,
    rating: 4.6,
    usageCount: 634
  }
];

export const formatOptions = ["16:9", "9:16", "1:1", "4:3"];
export const styleOptions = ["Cinematic", "Documentary", "Commercial", "Artistic", "Corporate"];
export const cameraMovementOptions = ["pan", "dolly", "orbit", "truck", "zoom", "static"];
export const resolutionOptions = ["1080p", "4K", "720p"];
export const bitrateOptions = ["5Mbps", "10Mbps", "20Mbps"];
export const codecOptions = ["H.264", "H.265", "ProRes"];
export const formatOptionsExport = ["MP4", "MOV", "AVI"];
export const frameRateOptions = ["24fps", "30fps", "60fps"];
