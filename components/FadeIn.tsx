import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

const variants = {
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  hidden: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
}

const childVariants = {
  show: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  hidden: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
}
const FadeIn = ({
  children,
  className,
  childrenClass,
}: {
  children: ReactNode | ReactNode[]
  className?: string
  childrenClass?: (string | undefined)[]
}) => {
  return Array.isArray(children) ? (
    <motion.div
      className={className}
      initial="hidden"
      animate="show"
      variants={variants}
    >
      {children.map((child, index) => (
        <motion.div
          className={childrenClass?.[index]}
          key={index}
          variants={childVariants}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  ) : (
    <>{children}</>
  )
}
export default FadeIn
