import { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SwipeButton = ({ onSwipe }: { onSwipe?: () => void }) => {
  const [isSwiped, setIsSwiped] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });
  const dragControls = useAnimation();
  const x = useMotionValue(0);

  const navigate = useNavigate();

  useEffect(() => {
    if (containerRef.current) {
      // Container width minus the draggable knob width and padding (approx 44px + 6px = 50px)
      const containerWidth = containerRef.current.offsetWidth;
      setDragConstraints({ left: 0, right: containerWidth - 52 });
    }
  }, []);

  const handleDragEnd = (event: any, info: any) => {
    if (isSwiped) return;

    const threshold = dragConstraints.right * 0.7; // 70% to trigger
    
    if (info.offset.x >= threshold) {
      setIsSwiped(true);
      dragControls.start({ x: dragConstraints.right });
      if (onSwipe) onSwipe();
      
      // Navigate to login page
      setTimeout(() => {
        navigate('/login');
      }, 500); // Small delay to let user see "Unlocked"
    } else {
      dragControls.start({ x: 0 });
    }
  };

  const opacity = useTransform(x, [0, dragConstraints.right * 0.5], [1, 0]);

  return (
    <div 
      ref={containerRef}
      className="relative flex items-center bg-[#000000] border-[3px] border-white rounded-full p-1 w-[352px] h-[55px] z-30 overflow-hidden"
    >
      {/* Background fill that expands as you drag */}
      <motion.div 
        className="absolute left-0 top-0 bottom-0 bg-[#000000]"
        style={{ width: useTransform(x, (value) => value + 44 + 6) }}
      />
      
      {/* The Draggable Knob */}
      <motion.div
        drag={isSwiped ? false : "x"}
        dragConstraints={dragConstraints}
        dragElastic={0.1}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        animate={dragControls}
        style={{ x }}
        className="relative z-20 bg-white rounded-full p-2.5 cursor-grab active:cursor-grabbing shrink-0"
      >
        <ArrowRight className="w-5 h-5 text-black" />
      </motion.div>
      
      {/* Hidden text to size the container properly */}
      <span className="text-[11px] font-bold tracking-[0.15em] uppercase opacity-0 pointer-events-none pl-5 pr-10 select-none">
        Swipe to Get Started / Join Now
      </span>

      {/* Visible text that fades out */}
      <motion.span 
        style={{ opacity }}
        className="absolute left-[60px] text-white text-[11px] font-bold tracking-[0.15em] uppercase pointer-events-none select-none"
      >
        {isSwiped ? 'Unlocked!' : 'Swipe to Get Started / Join Now'}
      </motion.span>
    </div>
  );
};
