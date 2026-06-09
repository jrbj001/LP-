'use client'

import { motion } from 'framer-motion'

const nodes = [
  { label: 'Data', x: 15, y: 30 },
  { label: 'Knowledge', x: 38, y: 18 },
  { label: 'Vision', x: 62, y: 25 },
  { label: 'Memory', x: 82, y: 35 },
  { label: 'Reasoning', x: 50, y: 55 },
  { label: 'Operations', x: 75, y: 65 },
]

const edges: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [1, 4], [2, 4], [3, 5], [4, 5], [0, 4],
]

function NetworkAnimation() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        className="absolute top-0 right-0 w-[70%] h-full opacity-[0.07]"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        {edges.map(([from, to], i) => (
          <motion.line
            key={i}
            x1={nodes[from].x}
            y1={nodes[from].y}
            x2={nodes[to].x}
            y2={nodes[to].y}
            stroke="white"
            strokeWidth="0.15"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, delay: 0.5 + i * 0.15, ease: 'easeOut' }}
          />
        ))}
        {nodes.map((node, i) => (
          <motion.circle
            key={i}
            cx={node.x}
            cy={node.y}
            r="0.8"
            fill="white"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.12 }}
          />
        ))}
        {nodes.map((node, i) => (
          <motion.circle
            key={`pulse-${i}`}
            cx={node.x}
            cy={node.y}
            r="0.8"
            fill="none"
            stroke="white"
            strokeWidth="0.1"
            initial={{ scale: 1, opacity: 0.4 }}
            animate={{ scale: 4, opacity: 0 }}
            transition={{
              duration: 3,
              delay: 1.5 + i * 0.4,
              repeat: Infinity,
              repeatDelay: 2,
            }}
          />
        ))}
      </svg>

      <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] rounded-full bg-white/[0.02] blur-[120px]" />
    </div>
  )
}

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-[72px]">
      <NetworkAnimation />

      <div className="relative z-10 mx-auto max-w-[1200px] px-6 py-24 md:py-32">
        <motion.p
          className="font-mono text-xs tracking-[0.2em] uppercase text-text-muted mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          AI Product &amp; Infrastructure Company
        </motion.p>

        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-[-0.03em] max-w-4xl mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          Building Intelligence Platforms for{' '}
          <span className="text-text-secondary">Real Operations</span>
        </motion.h1>

        <motion.p
          className="text-base sm:text-lg text-text-secondary max-w-2xl leading-relaxed mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          We design and develop AI-native platforms, adaptive intelligence
          systems and operational software that help organizations automate
          complex workflows, make better decisions and create lasting
          competitive advantages.
        </motion.p>

        <motion.div
          className="flex flex-wrap gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <a
            href="#cta"
            className="px-7 py-3.5 text-sm font-medium bg-white text-black rounded-full hover:bg-white/90 transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.12)]"
          >
            Work With Us
          </a>
          <a
            href="#ventures"
            className="px-7 py-3.5 text-sm font-medium border border-white/[0.14] rounded-full text-text-secondary hover:text-text-primary hover:border-white/30 transition-all"
          >
            Explore Ventures
          </a>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
    </section>
  )
}
