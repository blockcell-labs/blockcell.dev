import { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface Block {
  id: number;
  x: number;
  y: number;
  scale: number;
  color: string;
}

export function ReplicatorSwarm() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate initial blocks
    const newBlocks: Block[] = [];
    const count = 50;
    const colors = ['bg-purple-500', 'bg-rust', 'bg-blue-500', 'bg-slate-300'];

    for (let i = 0; i < count; i++) {
      newBlocks.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        scale: 0.5 + Math.random() * 1,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    setBlocks(newBlocks);
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none -z-10 opacity-30">
      {blocks.map((block) => (
        <ReplicatorBlock key={block.id} block={block} />
      ))}
    </div>
  );
}

function ReplicatorBlock({ block }: { block: Block }) {
  const controls = useAnimation();

  useEffect(() => {
    const animate = async () => {
      while (true) {
        // Move to random position
        await controls.start({
          x: `${Math.random() * 100}vw`,
          y: `${Math.random() * 100}vh`,
          rotate: Math.random() * 360,
          scale: block.scale,
          transition: { 
            duration: 10 + Math.random() * 20, 
            ease: "linear" 
          }
        });
        
        // Assemble/Cluster behavior (mocked by moving to center briefly)
        if (Math.random() > 0.7) {
            await controls.start({
                x: "50vw",
                y: "50vh",
                transition: { duration: 2, ease: "easeInOut" }
            });
            await new Promise(r => setTimeout(r, 500));
        }
      }
    };
    animate();
  }, [controls, block.scale]);

  return (
    <motion.div
      animate={controls}
      initial={{ 
        x: `${block.x}vw`, 
        y: `${block.y}vh`,
        opacity: 0 
      }}
      whileInView={{ opacity: 0.8 }}
      className={`absolute w-4 h-8 ${block.color} shadow-[0_0_10px_rgba(120,119,198,0.5)]`}
      style={{ 
        borderRadius: '2px',
        border: '1px solid rgba(255,255,255,0.3)'
      }}
    />
  );
}
