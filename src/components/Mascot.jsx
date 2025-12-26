
import React from 'react';
import { motion } from 'framer-motion';

const Mascot = ({ isSpeaking }) => {
    return (
        <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Glow effect */}
            <motion.div
                className="absolute inset-0 bg-purple-500 rounded-full blur-xl opacity-20"
                animate={{ opacity: isSpeaking ? [0.2, 0.5, 0.2] : 0.2 }}
                transition={{ duration: 1.5, repeat: Infinity }}
            />

            {/* Robot Container */}
            <motion.div
                className="relative"
                animate={{ y: isSpeaking ? [0, -5, 0] : 0 }}
                transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
            >

                {/* Head */}
                <div className="w-24 h-20 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-2xl shadow-lg relative border-2 border-purple-300 overflow-hidden">
                    {/* Eyes Container */}
                    <div className="absolute top-6 left-0 right-0 flex justify-center space-x-4">
                        {/* Left Eye */}
                        <motion.div
                            className="w-3 h-3 bg-cyan-300 rounded-full shadow-[0_0_10px_rgba(103,232,249,0.8)]"
                            animate={{ scaleY: isSpeaking ? [1, 0.1, 1] : 1 }}
                            transition={{ duration: 3, repeat: Infinity, repeatDelay: Math.random() * 2 }}
                        />
                        {/* Right Eye */}
                        <motion.div
                            className="w-3 h-3 bg-cyan-300 rounded-full shadow-[0_0_10px_rgba(103,232,249,0.8)]"
                            animate={{ scaleY: isSpeaking ? [1, 0.1, 1] : 1 }}
                            transition={{ duration: 3, repeat: Infinity, repeatDelay: Math.random() * 2 }}
                        />
                    </div>

                    {/* Mouth */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                        <motion.div
                            className="bg-pink-400 rounded-full shadow-[0_0_5px_rgba(244,114,182,0.6)]"
                            initial={{ width: 24, height: 4 }}
                            animate={{
                                width: isSpeaking ? [20, 26, 20] : 24,
                                height: isSpeaking ? [4, 12, 4] : 4
                            }}
                            transition={{ duration: 0.2, repeat: isSpeaking ? Infinity : 0 }}
                        />
                    </div>

                    {/* Antennas */}
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-gray-400"></div>
                    <motion.div
                        className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-400 rounded-full shadow-lg"
                        animate={{ scale: isSpeaking ? [1, 1.5, 1] : 1 }}
                        transition={{ duration: 1, repeat: Infinity }}
                    />
                </div>

                {/* Body (partial) */}
                <div className="w-16 h-8 bg-gray-700 mx-auto -mt-1 rounded-b-xl opacity-80"></div>
            </motion.div>
        </div>
    );
};

export default Mascot;
