"use client";

import { motion, Variants } from "framer-motion";
import { Star, Quote } from "lucide-react";

const reviews = [
    {
        id: 1,
        name: "Rajesh Kumar",
        location: "Delhi",
        rating: 5,
        date: "February 2026",
        text: "Stayed here during Phalguna Mela. The hospitality was exceptional and the proximity to the temple made our visit so convenient. Rooms were spotlessly clean and staff was very helpful."
    },
    {
        id: 2,
        name: "Priya Sharma",
        location: "Jaipur",
        rating: 5,
        date: "January 2026",
        text: "Beautiful hotel with traditional Rajasthani architecture. The food at their restaurant was absolutely delicious, especially the Dal Baati Churma. Highly recommend!"
    },
    {
        id: 3,
        name: "Amit Patel",
        location: "Mumbai",
        rating: 5,
        date: "December 2025",
        text: "A perfect blend of luxury and spirituality. The rooms are spacious and well-maintained. The staff went above and beyond to ensure our comfort. Will definitely visit again."
    }
];

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut",
            // 'when' is deprecated in favor of nested transition or orchestrating via staggerChildren on parent
            staggerChildren: 0.2
        }
    }
};

const iconVariants: Variants = {
    hidden: { scale: 0, opacity: 0, rotate: -45 },
    visible: {
        scale: 1,
        opacity: 1,
        rotate: 0,
        transition: {
            type: "spring",
            stiffness: 200,
            damping: 15
        }
    }
};

const starsContainerVariants: Variants = {
    hidden: { opacity: 1 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const starVariants: Variants = {
    hidden: { opacity: 0, scale: 0, rotate: -72 },
    visible: {
        opacity: 1,
        scale: 1,
        rotate: 0,
        transition: { type: "spring", stiffness: 300, damping: 20 }
    }
};

export function Testimonials() {
    return (
        <section id="reviews" className="py-24 bg-orange-50/30">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-orange-100 text-orange-600 text-sm font-medium mb-6"
                    >
                        <Star className="w-4 h-4 fill-current" />
                        <span>Guest Reviews</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="font-serif text-5xl font-bold mb-4 text-slate-900"
                    >
                        What Our Guests Say
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-600 text-lg"
                    >
                        Read authentic experiences from our valued guests
                    </motion.p>
                </div>

                {/* Reviews Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {reviews.map((review, index) => (
                        <motion.div
                            key={review.id}
                            variants={cardVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px", amount: 0.3 }}
                            className="relative bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-shadow duration-300 pt-12"
                        >
                            {/* Floating Quote Icon */}
                            <motion.div
                                variants={iconVariants}
                                className="absolute -top-6 -left-2 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-white"
                            >
                                <Quote className="w-6 h-6 fill-current" />
                            </motion.div>

                            {/* Stars */}
                            <motion.div
                                variants={starsContainerVariants}
                                className="flex gap-1 mb-6"
                            >
                                {[...Array(review.rating)].map((_, i) => (
                                    <motion.div key={i} variants={starVariants}>
                                        <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                                    </motion.div>
                                ))}
                            </motion.div>

                            {/* Text */}
                            <blockquote className="text-slate-600 italic leading-relaxed mb-8 min-h-[100px]">
                                "{review.text}"
                            </blockquote>

                            {/* Line */}
                            <div className="w-full h-px bg-slate-100 mb-6" />

                            {/* Author */}
                            <div className="flex justify-between items-end">
                                <div>
                                    <div className="font-serif text-lg font-bold text-slate-900 mb-1">
                                        {review.name}
                                    </div>
                                    <div className="text-sm text-slate-500">
                                        {review.location}
                                    </div>
                                </div>
                                <div className="text-xs text-slate-400 font-medium">
                                    {review.date}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
