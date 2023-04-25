import { motion, useTransform, useMotionValue } from 'framer-motion'
import { useEffect } from 'react'

const colors = [
  'linear-gradient(to right,rgba(255,255,255,.4) 0%,rgba(0, 0, 0, .4) 100%)',
  'linear-gradient(to right,rgba(36, 198, 220, .4) 0%,rgba(81, 74, 157, .4) 100%)',
  'linear-gradient(to right,rgba(9,90,155,.4) 0%,rgba(14,141,159,.4) 100%)',
]

const Gradient = () => {
  const range = 8000
  const time = useMotionValue(0)
  const background = useTransform(time, [0, range / 2, range], colors, {
    clamp: false,
  })
  useEffect(() => {
    let inc = 1
    const step = range / 80
    const timeId = window.setInterval(() => {
      let val = time.get()
      if (val >= range) {
        inc = 0
      }
      if (val <= 0) {
        inc = 1
      }
      inc ? (val += step) : (val -= step)
      time.set(val)
    }, 150)
    return () => {
      window.clearInterval(timeId)
    }
  }, [])

  return <motion.div style={{ background, height: '100%' }}></motion.div>
}

export default Gradient
