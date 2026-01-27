"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Wind, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";

import { RoomImageCarousel } from "./RoomImageCarousel";

interface Room {
    id: number;
    name: string;
    price: string;
    image: string;
    images?: string[];
    description: string;
    size: string;
    amenities: { icon: React.ElementType; label: string }[];
}

interface RoomDetailsModalProps {
    room: Room | null;
    onClose: () => void;
    onBook: () => void;
}

export function RoomDetailsModal({ room, onClose, onBook }: RoomDetailsModalProps) {
    if (!room) return null;

    const images = room.images || [room.image];

    // Extended amenities for the modal
    const extendedAmenities = [
        ...room.amenities,
        { icon: Wind, label: "Air Conditioning" },
        { icon: Utensils, label: "In-Room Dining" },
    ];

    const handleBookClick = () => {
        onBook();
    };

    return (
        <AnimatePresence>
            {room && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl pointer-events-auto flex flex-col md:flex-row overflow-hidden">
                            {/* ... Content ... */}
                            <div className="relative w-full md:w-1/2 h-64 md:h-auto bg-slate-100">
                                <RoomImageCarousel
                                    images={images}
                                    name={room.name}
                                    className="h-full"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:bg-gradient-to-r pointer-events-none" />

                                <button
                                    onClick={onClose}
                                    className="absolute top-4 left-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-colors md:hidden z-10"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="absolute bottom-6 left-6 text-white md:hidden pointer-events-none">
                                    <h3 className="font-serif text-3xl font-bold">{room.name}</h3>
                                    <p className="text-white/90 font-medium">{room.size} Ocean View</p>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="flex-1 p-8 flex flex-col bg-white overflow-y-auto">
                                <div className="hidden md:flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="font-serif text-3xl font-bold text-slate-900">{room.name}</h3>
                                        <p className="text-orange-600 font-medium tracking-wide uppercase text-xs mt-1">Heritage Collection</p>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full hover:bg-slate-100 -mr-2 -mt-2 w-10 h-10 p-0">
                                        <X className="w-5 h-5" />
                                    </Button>
                                </div>

                                <div className="prose prose-slate mb-8">
                                    <p className="text-slate-600 leading-relaxed">
                                        {room.description} Experience the ultimate in comfort with our carefully curated interiors, designed to reflect the divinity of the location while providing modern luxury.
                                    </p>
                                </div>

                                <h4 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">Room Amenities</h4>
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    {extendedAmenities.map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 text-slate-600">
                                            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                                                <item.icon className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-medium">{item.label}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* House Rules / Policies */}
                                <div className="mb-8 p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
                                    <h4 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wider flex items-center gap-2">
                                        Important Policies
                                    </h4>
                                    <ul className="space-y-2 text-sm text-slate-700">
                                        <li className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                                            <span>Guests must be <strong>Indian Nationals</strong> only.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                                            <span>Valid ID Proof required (Aadhar, Voter ID, Driving License). <span className="text-red-600 font-medium">PAN Card is NOT accepted.</span></span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between gap-6">
                                    <div className="flex flex-col">
                                        <span className="text-sm text-slate-400 font-medium line-through">₹{parseInt(room.price.replace(/[^0-9]/g, '')) + 2000}</span>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-serif font-bold text-slate-900">{room.price}</span>
                                            <span className="text-sm text-slate-500 font-medium">/ night</span>
                                        </div>
                                    </div>
                                    <Button onClick={handleBookClick} size="lg" className="flex-1 bg-slate-900 hover:bg-orange-600 text-white rounded-xl h-14 text-lg shadow-lg hover:shadow-orange-200 transition-all">
                                        Book Now
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </>
            )}
        </AnimatePresence>
    );
}
