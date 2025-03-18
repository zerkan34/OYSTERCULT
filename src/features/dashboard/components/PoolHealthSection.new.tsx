import { motion } from 'framer-motion';
import { modalAnimation, glassEffectStyle, ProgressBar } from '@/components/ui/CommonStyles';

export const PoolHealthSection = () => {
  return (
    <motion.div {...modalAnimation.overlay} className={glassEffectStyle}>
      <ProgressBar value={75} color="green" />
      <h1 className="text-white">Pool Health</h1>
    </motion.div>
  );
};