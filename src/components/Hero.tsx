import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowDown } from 'lucide-react';

interface InteractiveGridProps {
  hoverType: 'none' | 'heart' | 'arrow';
}

function InteractiveGrid({ hoverType }: InteractiveGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [grid, setGrid] = useState({ cols: 0, cells: 0 });
  const [heartCenterCells, setHeartCenterCells] = useState<number[]>([]);
  const [heartNeighborCells, setHeartNeighborCells] = useState<number[]>([]);
  const timeoutRefs = useRef<{ [key: number]: any }>({});

  useEffect(() => {
    const updateGrid = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.offsetWidth;
      const height = containerRef.current.offsetHeight;
      const cellSize = 40; // Slightly larger, perfectly sized grid cells
      const numCols = Math.ceil(width / cellSize);
      const numRows = Math.ceil(height / cellSize) + 1; // Add exactly one extra row of squares at the top
      setGrid({
        cols: numCols,
        cells: numCols * numRows,
      });
    };

    updateGrid();

    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      const observer = new ResizeObserver(updateGrid);
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    } else {
      window.addEventListener('resize', updateGrid);
      return () => window.removeEventListener('resize', updateGrid);
    }
  }, []);

  // Cleanup all timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(timeoutRefs.current).forEach(clearTimeout);
    };
  }, []);

  // Draw pattern shapes sequentially with center + neighboring support
  useEffect(() => {
    if (hoverType !== 'none' && grid.cols > 0) {
      const cols = grid.cols;
      const totalRows = Math.ceil(grid.cells / cols);
      
      // Calculate dynamic center row, with safety boundary padding to keep it away from top/bottom edges
      let cRow = Math.floor(totalRows / 2);
      if (totalRows >= 11) {
        cRow = Math.max(5, Math.min(cRow, totalRows - 7));
      }
      
      let cCol = Math.floor(cols / 2);
      // Shift the center of the shape to prevent overlap with main text while staying away from the right screen edge
      cCol = Math.max(6, Math.min(cols - 10, cCol + 1));

      // Specifically shift the heart and arrow one cell to the right as requested
      if (hoverType === 'heart' || hoverType === 'arrow') {
        cCol = cCol + 1;
      }

      // Choose path coordinates based on the hover type
      const steps = hoverType === 'heart' ? [
        [6, 0],   // Bottom tip
        [5, -1],
        [4, -2],
        [3, -3],
        [2, -4],
        [1, -5],
        [0, -6],
        [-1, -6],
        [-2, -6],
        [-3, -5],
        [-4, -4],
        [-4, -3],
        [-3, -2],
        [-2, -1],
        [-1, 0],  // Center dip valley
        [-2, 1],
        [-3, 2],
        [-4, 3],
        [-4, 4],
        [-3, 5],
        [-2, 6],
        [-1, 6],
        [0, 6],
        [1, 5],
        [2, 4],
        [3, 3],
        [4, 2],
        [5, 1],
        [6, 0]   // End tip
      ] : [
        [-4, 0],  // Top of arrow shaft (matching heart's maximum height)
        [-3, 0],
        [-2, 0],
        [-1, 0],
        [0, 0],
        [1, 0],
        [2, 0],
        [3, 0],
        [4, 0],
        [5, 0],
        [6, 0],   // Bottom tip of arrow (matching heart's bottom tip placement)
        // Left wing of arrowhead
        [5, -1],
        [4, -2],
        [3, -3],
        // Right wing of arrowhead
        [5, 1],
        [4, 2],
        [3, 3]
      ];

      // Reset states
      setHeartCenterCells([]);
      setHeartNeighborCells([]);

      let stepIdx = 0;
      const interval = setInterval(() => {
        if (stepIdx < steps.length) {
          const [r, c] = steps[stepIdx];
          const targetRow = cRow + r;
          const targetCol = cCol + c;

          if (targetRow >= 0 && targetRow < totalRows && targetCol >= 0 && targetCol < cols) {
            const centerIdx = targetRow * cols + targetCol;
            
            // Collect crosshair neighbors to serve as standard active neighbors (providing thickness)
            const neighbors: number[] = [];
            
            const offsets = [[-1, 0], [1, 0], [0, -1], [0, 1]];
            offsets.forEach(([nr, nc]) => {
              const nRow = targetRow + nr;
              const nCol = targetCol + nc;
              if (nRow >= 0 && nRow < totalRows && nCol >= 0 && nCol < cols) {
                neighbors.push(nRow * cols + nCol);
              }
            });

            // Update state
            setHeartCenterCells((prev) => prev.includes(centerIdx) ? prev : [...prev, centerIdx]);
            setHeartNeighborCells((prev) => {
              const filterNew = neighbors.filter(n => !prev.includes(n));
              return [...prev, ...filterNew];
            });
          }

          stepIdx++;
        } else {
          clearInterval(interval);
        }
      }, hoverType === 'heart' ? 25 : 30); // Pacing for drawing tracing animations

      return () => {
        clearInterval(interval);
      };
    } else {
      setHeartCenterCells([]);
      setHeartNeighborCells([]);
    }
  }, [hoverType, grid]);

  const activateCell = (idx: number, type: 'center' | 'neighbor') => {
    const el = containerRef.current?.querySelector(`[data-index="${idx}"]`);
    if (!el) return;

    // Remove active class states first to trigger instant activation on hover reentry
    el.classList.remove('grid-cell-active-center', 'grid-cell-active-neighbor');
    
    // Force browser reflow to apply removal instantly
    void (el as HTMLElement).offsetWidth;

    el.classList.add(type === 'center' ? 'grid-cell-active-center' : 'grid-cell-active-neighbor');

    if (timeoutRefs.current[idx]) {
      clearTimeout(timeoutRefs.current[idx]);
    }

    timeoutRefs.current[idx] = setTimeout(() => {
      el.classList.remove('grid-cell-active-center', 'grid-cell-active-neighbor');
      delete timeoutRefs.current[idx];
    }, 850); // Beautiful quick fade transition back to transparent
  };

  const handleCellHover = (index: number) => {
    const { cols, cells } = grid;
    if (cols === 0) return;

    // Activate the exact hovered cell at center premium glow
    activateCell(index, 'center');

    const row = Math.floor(index / cols);
    const col = index % cols;
    const totalRows = Math.ceil(cells / cols);

    // Form localized 2D geometric patterns (crosshair logic trail)
    const top = row > 0 ? index - cols : null;
    const bottom = row < totalRows - 1 ? index + cols : null;
    const left = col > 0 ? index - 1 : null;
    const right = col < cols - 1 ? index + 1 : null;

    if (top !== null) activateCell(top, 'neighbor');
    if (bottom !== null) activateCell(bottom, 'neighbor');
    if (left !== null) activateCell(left, 'neighbor');
    if (right !== null) activateCell(right, 'neighbor');
  };

  return (
    <div 
      ref={containerRef}
      className="absolute right-0 top-0 bottom-0 w-[45%] h-full overflow-hidden border-l border-[#858E97]/25 hidden md:block z-0 select-none pointer-events-auto"
    >
      {grid.cells > 0 && (
        <div 
          className="grid w-full h-full border-t border-l border-[#858E97]/15"
          style={{
            gridTemplateColumns: `repeat(${grid.cols}, 1fr)`,
          }}
        >
          {Array.from({ length: grid.cells }).map((_, index) => {
            const isCenterHeart = heartCenterCells.includes(index);
            const isNeighborHeart = heartNeighborCells.includes(index);

            let cellClass = 'grid-cell-base';
            if (isCenterHeart) {
              cellClass += ' grid-cell-active-center';
            } else if (isNeighborHeart && !isCenterHeart) {
              cellClass += ' grid-cell-active-neighbor';
            }

            return (
              <div 
                key={index}
                data-index={index}
                onMouseEnter={() => handleCellHover(index)}
                className={cellClass}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Hero() {
  const [hoverType, setHoverType] = useState<'none' | 'heart' | 'arrow'>('none');

  return (
    <motion.section 
      id="hero" 
      className="relative min-h-[78vh] md:min-h-[680px] flex flex-col justify-center pt-40 pb-16 md:pb-6 px-12 bg-[#FDFCFA] overflow-hidden border-b border-[#858E97]/30"
    >
      {/* 2D Geometric Mouse-Interactive Graph Grid */}
      <InteractiveGrid hoverType={hoverType} />

      <div className="max-w-6xl space-y-8 py-0 z-10 relative pointer-events-none">
        {/* Removed top line with the green dot as requested */}

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl md:text-6xl font-light leading-tight tracking-tight max-w-4xl text-[#32404F]"
        >
          I solve problems through <span className="font-semibold text-[#32404F]">intentional</span> design and systematic thinking - using AI for faster, elevated results.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="pt-4 pointer-events-auto flex flex-wrap gap-4 items-center"
        >
          {/* Primary Button: Explore my work */}
          <motion.button
            onClick={() => {
              const el = document.getElementById('Projects');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onMouseEnter={() => setHoverType('arrow')}
            onMouseLeave={() => setHoverType('none')}
            initial="initial"
            whileHover="hover"
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="inline-flex items-center gap-2.5 px-7 py-4 bg-[#32404F] hover:bg-[#32404F]/90 text-[#FDFCFA] rounded-full text-[15px] font-medium shadow-md group cursor-pointer relative overflow-hidden transition-all duration-300"
          >
            <span className="relative z-10 font-medium tracking-wide">
              Explore my work
            </span>
            <motion.div
              variants={{
                initial: { y: 0 },
                hover: { y: 3 }
              }}
              transition={{ type: "spring", stiffness: 350, damping: 15 }}
              className="text-white/90 group-hover:text-white flex items-center justify-center relative z-10"
            >
              <ArrowDown size={15} />
            </motion.div>
          </motion.button>

        </motion.div>
      </div>
    </motion.section>
  );
}
