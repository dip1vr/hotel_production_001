"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const galleryImages = [
    {
        src: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop",
        category: "Exterior",
        alt: "Hotel Exterior"
    },
    {
        src: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070&auto=format&fit=crop",
        category: "Rooms",
        alt: "Luxury Bedroom"
    },
    {
        src: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=2070&auto=format&fit=crop",
        category: "Suites",
        alt: "Royal Suite"
    },
    {
        src: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop",
        category: "Dining",
        alt: "Dining Hall"
    },
    {
        src: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=2070&auto=format&fit=crop",
        category: "Pool",
        alt: "Swimming Pool"
    },
    {
        src: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=2070&auto=format&fit=crop",
        category: "Lobby",
        alt: "Grand Lobby"
    },
    {
        src: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=2025&auto=format&fit=crop",
        category: "Events",
        alt: "Event Space"
    },
    {
        src: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=2070&auto=format&fit=crop",
        category: "Garden",
        alt: "Garden View"
    }
];

export function Gallery() {
    return (
        <section id="gallery" className="py-24 bg-white relative overflow-hidden">
            {/* Decorative background visual */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-50/50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2" />

            <div className="container mx-auto px-4">

                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="font-serif text-5xl md:text-6xl font-bold mb-4 text-slate-900"
                    >
                        Gallery
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-600 text-lg"
                    >
                        Explore the beauty and elegance of Shyam Heritage Palace
                    </motion.p>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {galleryImages.map((image, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            whileHover={{ y: -10 }}
                            className="relative aspect-[4/3] rounded-2xl overflow-hidden group cursor-pointer shadow-lg"
                        >
                            <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Badge */}
                            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 rounded-full text-xs font-medium text-white opacity-0 md:opacity-100 md:translate-y-0 translate-y-[-10px] group-hover:translate-y-0 transition-all duration-300">
                                {image.category}
                            </div>

                            {/* Mobile/Hover Text */}
                            <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
                                <span className="text-lg font-serif tracking-wide">{image.category}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-3 bg-white border border-slate-200 rounded-full shadow-sm text-slate-900 font-medium hover:bg-slate-50 hover:shadow-md transition-all"
                    >
                        View Full Gallery
                    </motion.button>
                </div>
            </div>
        </section>
    );
}
