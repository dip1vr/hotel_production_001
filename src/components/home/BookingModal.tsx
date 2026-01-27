"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, User, Phone, Users, Minus, Plus, Loader2, CheckCircle, ArrowRight, CreditCard, Smartphone, QrCode, Download } from "lucide-react";
import { toJpeg } from 'html-to-image';
import { TicketCard } from "./TicketCard";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { setDoc, doc, serverTimestamp, increment } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";

interface Room {
    id: number;
    name: string;
    price: string;
    image: string;
    images?: string[];
}

interface BookingModalProps {
    room: Room | null;
    isOpen: boolean;
    onClose: () => void;
}

export function BookingModal({ room, isOpen, onClose }: BookingModalProps) {
    const { user } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    // Initial state derived from room details
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [roomsCount, setRoomsCount] = useState(1);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [totalNights, setTotalNights] = useState(0);

    // Payment & Flow State
    const [step, setStep] = useState(1); // 1: Details, 2: Payment, 3: Ticket
    const [paymentMethod, setPaymentMethod] = useState("card"); // card, upi, wallet
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [bookingId, setBookingId] = useState("");
    const [isDownloading, setIsDownloading] = useState(false);
    const ticketRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setBookingId("");
            setError("");
            setIsDownloading(false);
            setPaymentMethod("card");
            // Optional: retain dates/guests if desired, or reset them too.
            // For now, keeping dates/guests as they might be pre-filled from context or previous selection logic.
        }
    }, [isOpen]);

    useEffect(() => {
        if (checkIn && checkOut) {
            const start = new Date(checkIn);
            const end = new Date(checkOut);
            const diffTime = Math.abs(end.getTime() - start.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setTotalNights(diffDays > 0 ? diffDays : 0);
        } else {
            setTotalNights(0);
        }
    }, [checkIn, checkOut]);

    const handleAdultsChange = (increment: boolean) => {
        const newAdults = increment ? adults + 1 : Math.max(1, adults - 1);
        setAdults(newAdults);
        // Auto-adjust rooms: 1 room for every 3 adults
        const requiredRooms = Math.ceil(newAdults / 3);
        if (roomsCount < requiredRooms) {
            setRoomsCount(requiredRooms);
        }
    };

    // Payment Calculations
    const parsePrice = (priceStr: string) => {
        return parseInt(priceStr.replace(/[^0-9]/g, '')) || 0;
    };

    const pricePerNight = room ? parsePrice(room.price) : 0;
    const basePrice = pricePerNight * roomsCount * (totalNights || 1);

    // GST Slabs (As per Govt of India Rules)
    let gstRate = 0;
    if (pricePerNight <= 1000) {
        gstRate = 0;
    } else if (pricePerNight <= 7500) {
        gstRate = 0.12; // Keeping 12% as it's the standard widely known rate for hotels in this slab.
    } else {
        gstRate = 0.18;
    }

    const taxAmount = Math.round(basePrice * gstRate);
    const totalPrice = basePrice + taxAmount;

    if (!isOpen || !room) return null;

    const generateBookingId = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const randomStr = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
        return `BK-${randomStr}`;
    };

    const handleNextStep = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Authentication Check
        if (!user) {
            setIsAuthModalOpen(true);
            return;
        }

        if (step === 1) {
            // Validate Step 1
            if (!checkIn || !checkOut || !name || !phone) {
                setError("Please fill in all details");
                return;
            }
            setStep(2);
        } else if (step === 2) {
            handleFinalPayment();
        }
    };

    const handleFinalPayment = async () => {
        setIsSubmitting(true);
        const newBookingId = generateBookingId();

        // Simulate Payment Delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            // Create user profile reference (update with analysis data)
            if (user) {
                const userRef = doc(db, "users", user.uid);
                await setDoc(userRef, {
                    email: user.email,
                    lastBookingAt: serverTimestamp(),
                    bookingsCount: increment(1),
                    totalSpend: increment(totalPrice)
                }, { merge: true });
            }

            // Save structured booking
            await setDoc(doc(db, "bookings", newBookingId), {
                bookingId: newBookingId,
                userId: user?.uid, // Top-level for querying
                userEmail: user?.email, // Top-level for querying
                guest: {
                    userId: user?.uid,
                    name: name,
                    email: user?.email,
                    phone: phone
                },
                stay: {
                    checkIn,
                    checkOut,
                    totalNights: totalNights || 1,
                    adults,
                    children,
                    roomsCount
                },
                room: {
                    name: room.name,
                    image: room.image,
                    basePricePerNight: parsePrice(room.price)
                },
                payment: {
                    method: paymentMethod,
                    baseAmount: basePrice,
                    taxAmount: taxAmount,
                    totalAmount: totalPrice,
                    currency: "INR",
                    status: "paid"
                },
                status: "confirmed",
                createdAt: serverTimestamp(),
            });

            setBookingId(newBookingId);
            setStep(3);
        } catch (err) {
            console.error("Error adding booking: ", err);
            setError("Payment failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };
    const handleDownloadTicket = async () => {
        // Element from ref or search by ID (TicketCard sets ID as `ticket-${bookingId}`)
        const element = ticketRef.current || document.getElementById(`ticket-${bookingId}`);
        if (!element) {
            console.error("Ticket element not found");
            alert("Error: Ticket element not found!");
            return;
        }

        setIsDownloading(true);
        try {


            // Get accurate dimensions
            const width = element.offsetWidth;
            const height = element.offsetHeight;

            const dataUrl = await toJpeg(element as HTMLElement, {
                quality: 0.95,
                backgroundColor: "#0f172a",
                width: width,
                height: height,
                style: {
                    margin: '0', // Reset any margins that might cause offsets
                    transform: 'none', // Reset transforms
                    borderRadius: "1.5rem",
                }
            });

            const link = document.createElement('a');
            link.download = `Booking-${bookingId}.jpg`;
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);


        } catch (err: any) {
            console.error("Download failed", err);
            alert(`Download failed: ${err.message || err}`);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={step === 3 ? onClose : undefined}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl pointer-events-auto overflow-hidden max-h-[90vh] flex flex-col">
                            {/* Header - Hidden on Ticket Step for immersive look */}
                            {step !== 3 && (
                                <div className="bg-slate-900 p-6 flex items-start justify-between shrink-0">
                                    <div>
                                        <h2 className="text-2xl font-serif font-bold text-white mb-1">
                                            {step === 1 ? "Confirm Details" : "Payment (Demo)"}
                                        </h2>
                                        <p className="text-slate-400 text-sm">
                                            {step === 1 ? "Step 1 of 2" : "Test Mode - No real payment required"}
                                        </p>
                                    </div>
                                    <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            )}

                            {/* Body */}
                            <div className="p-6 overflow-y-auto custom-scrollbar">
                                {step === 1 && (
                                    <form id="booking-form" onSubmit={handleNextStep} className="space-y-6">

                                        {/* Dates */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Check In</label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                    <input
                                                        type="date"
                                                        required
                                                        value={checkIn}
                                                        onChange={(e) => setCheckIn(e.target.value)}
                                                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-orange-500/20"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Check Out</label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                    <input
                                                        type="date"
                                                        required
                                                        value={checkOut}
                                                        onChange={(e) => setCheckOut(e.target.value)}
                                                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-orange-500/20"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Date Info */}
                                        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                                            <div className="flex gap-4">
                                                <span>Check-in: <strong className="text-slate-900">12:00 PM</strong></span>
                                                <span>Check-out: <strong className="text-slate-900">11:00 AM</strong></span>
                                            </div>
                                            {totalNights > 0 && (
                                                <span className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full font-bold">
                                                    {totalNights} Night{totalNights > 1 ? 's' : ''}
                                                </span>
                                            )}
                                        </div>

                                        {/* Counters */}
                                        <div className="space-y-3 bg-slate-50 p-4 rounded-xl">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-600 shadow-sm">
                                                        <Users className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900">Adults</p>
                                                        <p className="text-xs text-slate-500">Max 3 per room</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 bg-white px-2 py-1 rounded-lg border border-slate-200">
                                                    <button type="button" onClick={() => handleAdultsChange(false)} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600"><Minus className="w-3 h-3" /></button>
                                                    <span className="text-sm font-bold w-4 text-center">{adults}</span>
                                                    <button type="button" onClick={() => handleAdultsChange(true)} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600"><Plus className="w-3 h-3" /></button>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-600 shadow-sm">
                                                        <Users className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900">Children</p>
                                                        <p className="text-xs text-orange-600">Under 5 years allowed</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 bg-white px-2 py-1 rounded-lg border border-slate-200">
                                                    <button type="button" onClick={() => setChildren(Math.max(0, children - 1))} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600"><Minus className="w-3 h-3" /></button>
                                                    <span className="text-sm font-bold w-4 text-center">{children}</span>
                                                    <button type="button" onClick={() => setChildren(children + 1)} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600"><Plus className="w-3 h-3" /></button>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                                                <div className="flex items-center gap-2">
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900">Rooms</p>
                                                        <p className="text-xs text-slate-500">Auto-adjusted based on adults</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 bg-white px-2 py-1 rounded-lg border border-slate-200">
                                                    <button
                                                        type="button"
                                                        onClick={() => setRoomsCount(Math.max(1, roomsCount - 1))}
                                                        className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="text-sm font-bold w-4 text-center">{roomsCount}</span>
                                                    <button type="button" onClick={() => setRoomsCount(roomsCount + 1)} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600"><Plus className="w-3 h-3" /></button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Personal Info */}
                                        <div className="space-y-4">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                    <input
                                                        type="text"
                                                        required
                                                        placeholder="Enter your full name"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        className="w-full pl-9 pr-4 py-3 bg-slate-50 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-orange-500/20"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Number</label>
                                                <div className="relative">
                                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                    <input
                                                        type="tel"
                                                        required
                                                        placeholder="+91 98765 43210"
                                                        value={phone}
                                                        onChange={(e) => setPhone(e.target.value)}
                                                        className="w-full pl-9 pr-4 py-3 bg-slate-50 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-orange-500/20"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                                            <h4 className="text-xs font-bold text-orange-800 uppercase mb-2">Important Requirements:</h4>
                                            <ul className="space-y-1">
                                                <li className="flex items-start gap-2 text-xs text-orange-900/80">
                                                    <span className="w-1 h-1 rounded-full bg-orange-600 mt-1.5" />
                                                    Indian Nationals Only.
                                                </li>
                                                <li className="flex items-start gap-2 text-xs text-orange-900/80">
                                                    <span className="w-1 h-1 rounded-full bg-orange-600 mt-1.5" />
                                                    Valid Govt ID required. <span className="font-bold">PAN Card not accepted.</span>
                                                </li>
                                            </ul>
                                        </div>

                                        {/* Payment Summary */}
                                        <div className="bg-slate-50 p-4 rounded-xl space-y-3">
                                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Payment Details</h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between text-slate-600">
                                                    <span>Room Charges ({roomsCount} Room x {totalNights || 1} Night)</span>
                                                    <span>₹{basePrice.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between text-slate-600">
                                                    <span>GST ({(gstRate * 100)}%)</span>
                                                    <span>₹{taxAmount.toLocaleString()}</span>
                                                </div>
                                                <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-base">
                                                    <span>Total Amount</span>
                                                    <span>₹{totalPrice.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                )}

                                {step === 2 && (
                                    <div className="space-y-6">
                                        <div className="bg-slate-50 p-4 rounded-xl space-y-3">
                                            <h3 className="font-bold text-slate-900">Order Summary</h3>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between text-slate-600">
                                                    <span>Room Charges ({roomsCount} x {totalNights} nights)</span>
                                                    <span>₹{basePrice.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between text-slate-600">
                                                    <span>GST ({(gstRate * 100)}%)</span>
                                                    <span>₹{taxAmount.toLocaleString()}</span>
                                                </div>
                                                <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-lg">
                                                    <span>To Pay</span>
                                                    <span>₹{totalPrice.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Select Payment Method</h3>
                                            <div className="grid grid-cols-1 gap-3">
                                                <button
                                                    onClick={() => setPaymentMethod('card')}
                                                    className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${paymentMethod === 'card' ? 'border-orange-500 bg-orange-50/50' : 'border-slate-100 hover:border-slate-200'}`}
                                                >
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentMethod === 'card' ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500'}`}>
                                                        <CreditCard className="w-5 h-5" />
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="font-bold text-slate-900">Credit / Debit Card</p>
                                                        <p className="text-xs text-slate-500">Visa, Mastercard, RuPay</p>
                                                    </div>
                                                    {paymentMethod === 'card' && <CheckCircle className="w-5 h-5 text-orange-500 ml-auto" />}
                                                </button>

                                                <button
                                                    onClick={() => setPaymentMethod('upi')}
                                                    className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${paymentMethod === 'upi' ? 'border-orange-500 bg-orange-50/50' : 'border-slate-100 hover:border-slate-200'}`}
                                                >
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentMethod === 'upi' ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500'}`}>
                                                        <Smartphone className="w-5 h-5" />
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="font-bold text-slate-900">UPI</p>
                                                        <p className="text-xs text-slate-500">GPay, PhonePe, Paytm</p>
                                                    </div>
                                                    {paymentMethod === 'upi' && <CheckCircle className="w-5 h-5 text-orange-500 ml-auto" />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {step === 3 && (
                                    <div className="text-center py-2">
                                        <TicketCard
                                            ref={ticketRef}
                                            bookingId={bookingId}
                                            roomName={room.name}
                                            checkIn={checkIn}
                                            checkOut={checkOut}
                                            guestName={name}
                                            totalPrice={totalPrice}
                                            className="mb-6"
                                        />

                                        <p className="text-sm text-slate-500 mb-6">A confirmation email has been sent to your email address.</p>

                                        <div className="flex flex-col gap-3">
                                            <Button
                                                onClick={handleDownloadTicket}
                                                disabled={isDownloading}
                                                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 h-12 rounded-xl text-base font-bold transition-all flex items-center justify-center gap-2"
                                            >
                                                {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                                                {isDownloading ? "Downloading..." : "Download Ticket"}
                                            </Button>

                                            <Button onClick={onClose} className="w-full bg-slate-900 hover:bg-slate-800 text-white h-12 rounded-xl text-base font-bold transition-all">
                                                Close
                                            </Button>
                                        </div>
                                    </div>

                                )}

                                {error && (
                                    <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mt-4">
                                        {error}
                                    </div>
                                )}
                            </div>

                            {/* Footer Actions (Hidden on Ticket Step) */}
                            {step !== 3 && (
                                <div className="p-6 border-t border-slate-100 bg-slate-50 mt-auto">
                                    <Button
                                        form={step === 1 ? "booking-form" : undefined}
                                        type={step === 1 ? "submit" : "button"}
                                        onClick={step === 2 ? handleFinalPayment : undefined}
                                        disabled={isSubmitting}
                                        className="w-full bg-slate-900 hover:bg-orange-600 text-white h-12 rounded-xl text-base font-bold shadow-lg shadow-slate-200 transition-all"
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : step === 1 ? (
                                            <>Proceed to Payment <ArrowRight className="w-5 h-5 ml-2" /></>
                                        ) : (
                                            <>Pay ₹{totalPrice.toLocaleString()} <ArrowRight className="w-5 h-5 ml-2" /></>
                                        )}
                                    </Button>
                                    {step === 2 && (
                                        <button
                                            onClick={() => setStep(1)}
                                            className="w-full text-center text-slate-500 text-sm hover:text-slate-800 mt-4 font-medium"
                                        >
                                            Back to Details
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                    <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
                </>
            )}
        </AnimatePresence>
    );
}
