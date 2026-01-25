"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Users, Search, Minus, Plus, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BookingBar() {
    const [isOpen, setIsOpen] = useState(false);
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [rooms, setRooms] = useState(1);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Auto-adjust rooms based on adults (Max 3 adults per room)
    useEffect(() => {
        const requiredRooms = Math.ceil(adults / 3);
        if (rooms < requiredRooms) {
            setRooms(requiredRooms);
        }
    }, [adults]); // Only run when adults change to auto-increase. 
    // We don't auto-decrease rooms to avoid annoying the user if they want extra rooms, 
    // but we enforce the minimum in the decrement handler.

    const handleAdultsChange = (delta: number) => {
        const newAdults = adults + delta;
        if (newAdults >= 1) {
            setAdults(newAdults);
        }
    };

    const handleChildrenChange = (delta: number) => {
        const newChildren = children + delta;
        if (newChildren >= 0) {
            setChildren(newChildren);
        }
    };

    const handleRoomsChange = (delta: number) => {
        const newRooms = rooms + delta;
        const requiredRooms = Math.ceil(adults / 3);

        // Only allow decreasing if we still have enough rooms for adults
        if (newRooms >= requiredRooms) {
            setRooms(newRooms);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            id="booking-bar"
            className="relative z-30 mt-4 md:-mt-24 mb-12 md:mb-20 px-4"
        >
            <div className="max-w-5xl mx-auto bg-white/95 backdrop-blur-sm rounded-3xl md:rounded-full shadow-2xl shadow-slate-200/50 p-4 md:p-3 md:pl-8 md:pr-3 flex flex-col md:flex-row items-center gap-4 md:gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100 border border-white/50 ring-1 ring-slate-100 transition-all duration-300">

                {/* Check In */}
                <div className="flex-1 flex items-center gap-4 w-full p-2 group cursor-pointer hover:bg-slate-50/50 rounded-2xl transition-colors">
                    <div className="p-2.5 bg-orange-50/50 group-hover:bg-orange-50 text-orange-600 rounded-full transition-colors shrink-0">
                        <Calendar className="w-5 h-5 stroke-[1.5]" />
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                        <label className="text-[11px] uppercase font-bold text-slate-400 tracking-widest mb-1 transition-colors group-hover:text-orange-600/70">Check In</label>
                        <input
                            type="date"
                            className="text-sm font-medium text-slate-900 outline-none w-full bg-transparent font-sans h-6 cursor-pointer tracking-wide placeholder:text-slate-900"
                        />
                    </div>
                </div>

                {/* Check Out */}
                <div className="flex-1 flex items-center gap-4 w-full p-2 md:pl-8 pt-4 md:pt-2 group cursor-pointer hover:bg-slate-50/50 rounded-2xl transition-colors">
                    <div className="p-2.5 bg-orange-50/50 group-hover:bg-orange-50 text-orange-600 rounded-full transition-colors shrink-0">
                        <Calendar className="w-5 h-5 stroke-[1.5]" />
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                        <label className="text-[11px] uppercase font-bold text-slate-400 tracking-widest mb-1 transition-colors group-hover:text-orange-600/70">Check Out</label>
                        <input
                            type="date"
                            className="text-sm font-medium text-slate-900 outline-none w-full bg-transparent font-sans h-6 cursor-pointer tracking-wide"
                        />
                    </div>
                </div>

                {/* Guests & Rooms */}
                <div className="relative flex-1 w-full" ref={containerRef}>
                    <div
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-4 w-full p-2 md:pl-8 pt-4 md:pt-2 group cursor-pointer hover:bg-slate-50/50 rounded-2xl transition-colors select-none"
                    >
                        <div className="p-2.5 bg-orange-50/50 group-hover:bg-orange-50 text-orange-600 rounded-full transition-colors shrink-0">
                            <Users className="w-5 h-5 stroke-[1.5]" />
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                            <label className="text-[11px] uppercase font-bold text-slate-400 tracking-widest mb-1 transition-colors group-hover:text-orange-600/70">Guests & Rooms</label>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-900 truncate">
                                    {adults} Adult{adults !== 1 ? 's' : ''}, {rooms} Room{rooms !== 1 ? 's' : ''}
                                    {children > 0 && `, ${children} Child${children !== 1 ? 'ren' : ''}`}
                                </span>
                                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                            </div>
                        </div>
                    </div>

                    {/* Popover */}
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.15 }}
                                className="absolute top-[120%] left-0 md:-left-4 right-0 md:right-auto md:w-80 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-4 z-50 overflow-hidden"
                            >
                                <div className="space-y-4">
                                    {/* Adults Row */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-slate-900">Adults</p>
                                            <p className="text-xs text-slate-500">Max 3 per room</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleAdultsChange(-1); }}
                                                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:border-orange-500 hover:text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                disabled={adults <= 1}
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-6 text-center font-medium text-slate-900">{adults}</span>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleAdultsChange(1); }}
                                                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:border-orange-500 hover:text-orange-600 transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Children Row */}
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                        <div>
                                            <p className="font-semibold text-slate-900">Children</p>
                                            <p className="text-xs text-slate-500 text-orange-600">Under 5 years allowed</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleChildrenChange(-1); }}
                                                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:border-orange-500 hover:text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                disabled={children <= 0}
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-6 text-center font-medium text-slate-900">{children}</span>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleChildrenChange(1); }}
                                                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:border-orange-500 hover:text-orange-600 transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Rooms Row */}
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                        <div>
                                            <p className="font-semibold text-slate-900">Rooms</p>
                                            <p className="text-xs text-slate-500">Auto-adjusted based on adults</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleRoomsChange(-1); }}
                                                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:border-orange-500 hover:text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                disabled={rooms <= Math.ceil(adults / 3)}
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-6 text-center font-medium text-slate-900">{rooms}</span>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleRoomsChange(1); }}
                                                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:border-orange-500 hover:text-orange-600 transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Search Button */}
                <div className="w-full md:w-auto p-1 pt-4 md:pt-0">
                    <Button
                        onClick={() => alert(`Booking functionality would open here!\nCheck In: [Date]\nCheck Out: [Date]\nAdults: ${adults}\nChildren: ${children}\nRooms: ${rooms}`)}
                        className="w-full md:w-auto h-14 md:h-12 rounded-full px-8 bg-slate-900 hover:bg-orange-600 text-white shadow-xl shadow-slate-900/10 hover:shadow-orange-600/20 flex items-center justify-center gap-2.5 transition-all duration-300 active:scale-95 group"
                    >
                        <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span className="font-medium tracking-wide">Book Now</span>
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}
