"use client";

import { motion } from "framer-motion";
import { Sparkles, MapPin, Phone, Mail } from "lucide-react";

export function ContactSection() {
    return (
        <section id="contact" className="py-24 bg-white">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-orange-100/80 text-orange-700 text-sm font-semibold mb-6"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span>Get In Touch</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="font-serif text-5xl font-bold mb-4 text-slate-900"
                    >
                        Contact Us
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-600 text-lg"
                    >
                        We're here to help make your stay memorable. Reach out to us anytime!
                    </motion.p>
                </div>

                {/* Visit Us Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="flex flex-col md:flex-row bg-[#FFF9F2] rounded-3xl overflow-hidden border border-orange-50">
                        {/* Left Side - Info */}
                        <div className="p-10 md:p-12 md:w-2/3">
                            <h3 className="font-serif text-3xl font-bold text-slate-900 mb-8">Visit Us</h3>

                            <div className="space-y-8">
                                {/* Address */}
                                <div className="flex items-start gap-6">
                                    <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-orange-200">
                                        <MapPin className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-1">Address</h4>
                                        <p className="text-slate-600 leading-relaxed">
                                            Near Khatu Shyam Ji Temple,<br />
                                            Ringas Road, Sikar,<br />
                                            Rajasthan, India - 332602
                                        </p>
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div className="flex flex-col sm:flex-row gap-8">
                                    <div className="flex items-start gap-6">
                                        <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-orange-200">
                                            <Phone className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 mb-1">Phone</h4>
                                            <div className="text-slate-600 space-y-1">
                                                <p>+91 98765 43210</p>
                                                <p>+91 12345 67890</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-6">
                                        <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-orange-200">
                                            <Mail className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 mb-1">Email</h4>
                                            <p className="text-slate-600">info@shyamheritage.com</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Map Placeholder / Decorative Image */}
                        <div className="md:w-1/3 bg-orange-100 relative min-h-[300px] md:min-h-0">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3546.046162394593!2d75.39764531505364!3d27.37367898293126!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396c90b0e3340dcd%3A0xe54d3d750c182542!2sKhatu%20Shyam%20Ji%20Temple!5e0!3m2!1sen!2sin!4v1647845682121!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0, filter: "grayscale(20%) sepia(10%)" }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="absolute inset-0 w-full h-full opacity-90 hover:opacity-100 transition-opacity"
                            />
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
