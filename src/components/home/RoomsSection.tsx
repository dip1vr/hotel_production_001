"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Wifi, Tv, Coffee, Maximize2 } from "lucide-react";
import { BookingBar } from "./BookingBar";
import { RoomDetailsModal } from "./RoomDetailsModal";
import { BookingModal } from "./BookingModal";

const rooms = [
    {
        id: 1,
        name: "Deluxe Room",
        price: "₹3,500",
        image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80",
        description: "Elegant sanctuary with modern amenities and garden views.",
        size: "350 sq ft",
        amenities: [
            { icon: Wifi, label: "Fast Wifi" },
            { icon: Tv, label: "Smart TV" },
            { icon: Coffee, label: "Mini Bar" }
        ]
    },
    {
        id: 2,
        name: "Super Deluxe",
        price: "₹5,500",
        image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
        description: "Spacious luxury with a private balcony and premium bedding.",
        size: "450 sq ft",
        amenities: [
            { icon: Wifi, label: "Fast Wifi" },
            { icon: Tv, label: "Smart TV" },
            { icon: Coffee, label: "Mini Bar" }
        ]
    },
    {
        id: 3,
        name: "Royal Suite",
        price: "₹8,500",
        image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80",
        description: "The epitome of heritage luxury with panoramic temple views.",
        size: "650 sq ft",
        amenities: [
            { icon: Wifi, label: "Fast Wifi" },
            { icon: Tv, label: "Smart TV" },
            { icon: Coffee, label: "Mini Bar" }
        ]
    },
];

export function RoomsSection() {
    const [selectedRoom, setSelectedRoom] = useState<typeof rooms[0] | null>(null);
    const [bookingRoom, setBookingRoom] = useState<typeof rooms[0] | null>(null);

    const handleBookNow = (room: typeof rooms[0]) => {
        setBookingRoom(room);
        setSelectedRoom(null);
    };

    return (
        <section id="rooms" className="pb-24 bg-slate-50 relative">
            <div className="container mx-auto px-4">

                {/* Booking Bar (Floating overlap) */}
                <div id="booking-bar">
                    <BookingBar />
                </div>

                <div className="text-center max-w-2xl mx-auto mb-16 pt-8">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="font-serif text-4xl md:text-5xl font-bold mb-4 text-slate-900"
                    >
                        Luxury Accommodations
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-600 text-lg"
                    >
                        Experience the perfect blend of traditional heritage and modern comfort
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {rooms.map((room, index) => (
                        <motion.div
                            key={room.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group bg-white rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col border border-slate-100"
                        >
                            {/* Image */}
                            <div className="relative h-72 overflow-hidden cursor-pointer" onClick={() => setSelectedRoom(room)}>
                                <Image
                                    src={room.image}
                                    alt={room.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-900 shadow-sm flex items-center gap-1">
                                    <Maximize2 className="w-3 h-3" /> {room.size}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-8 flex flex-col flex-grow">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-serif text-2xl font-bold text-slate-900 mb-1">{room.name}</h3>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-xl font-bold text-orange-600">{room.price}</span>
                                            <span className="text-sm text-slate-400">/ night</span>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-slate-500 text-sm mb-6 leading-relaxed line-clamp-2">
                                    {room.description}
                                </p>

                                {/* Divider */}
                                <div className="w-12 h-1 bg-orange-100 mb-6" />

                                <div className="flex gap-4 mb-8">
                                    {room.amenities.map((item, i) => (
                                        <div key={i} className="flex items-center gap-1.5 text-slate-500">
                                            <item.icon className="w-4 h-4" />
                                            <span className="text-xs font-medium">{item.label}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Actions */}
                                <div className="mt-auto grid grid-cols-2 gap-3">
                                    <Button
                                        variant="outline"
                                        className="w-full border-slate-200 hover:bg-slate-50 text-slate-900"
                                        onClick={() => setSelectedRoom(room)}
                                    >
                                        Details
                                    </Button>
                                    <Button
                                        className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                                        onClick={() => handleBookNow(room)}
                                    >
                                        Book Now
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Room Details Modal */}
            <RoomDetailsModal
                room={selectedRoom}
                onClose={() => setSelectedRoom(null)}
                // In details modal, booking passes the currently viewed room
                onBook={() => selectedRoom && handleBookNow(selectedRoom)}
            />

            {/* Booking Wizard Modal */}
            <BookingModal
                room={bookingRoom}
                isOpen={!!bookingRoom}
                onClose={() => setBookingRoom(null)}
            />
        </section>
    );
}
