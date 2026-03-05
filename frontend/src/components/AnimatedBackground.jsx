import { motion } from 'framer-motion'

export default function AnimatedBackground() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-grid-pattern opacity-30" />

            <motion.div
                className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-500/15 rounded-full blur-[100px]"
                animate={{
                    x: [0, 60, -20, 0],
                    y: [0, -40, 30, 0],
                    scale: [1, 1.1, 0.95, 1],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="absolute bottom-1/4 -right-32 w-80 h-80 bg-secondary-500/10 rounded-full blur-[100px]"
                animate={{
                    x: [0, -50, 30, 0],
                    y: [0, 50, -20, 0],
                    scale: [1, 0.9, 1.1, 1],
                }}
                transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent-500/10 rounded-full blur-[80px]"
                animate={{
                    scale: [1, 1.2, 0.8, 1],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
            />
        </div>
    )
}
