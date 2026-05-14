import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera, Environment } from '@react-three/drei'
import { useRef, useEffect, useState, useMemo } from 'react'
import * as THREE from 'three'
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import './index.css'

gsap.registerPlugin(ScrollTrigger)

const MailIcon = () => <svg style={{ pointerEvents: 'none' }} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
const GithubIcon = () => <svg style={{ pointerEvents: 'none' }} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>;
const XIcon = () => <svg style={{ pointerEvents: 'none' }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 4.076H5.078z"/></svg>;
const LinkedinIcon = () => <svg style={{ pointerEvents: 'none' }} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
const ArrowUpIcon = () => <svg style={{ pointerEvents: 'none' }} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>;

// Refined Reactive Cursor - Fixed Centering and Inversion
function CustomCursor() {
  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)
  
  // Spring physics for smooth movement
  const springX = useSpring(mouseX, { stiffness: 500, damping: 40 })
  const springY = useSpring(mouseY, { stiffness: 500, damping: 40 })
  
  const [cursorState, setCursorState] = useState('default')

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Offset by half the width/height to center the cursor
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    
    const handleOver = (e: any) => {
      const target = e.target as HTMLElement
      
      const isButton = target.closest('.btn-stylish') || 
                       target.closest('.menu-trigger') || 
                       target.closest('.social-circle') ||
                       target.closest('.scroll-top-btn');

      const isGiantTarget = target.closest('.hero-title') || 
                            target.closest('.display-text') || 
                            target.closest('.contact-email') ||
                            target.tagName === 'H1' || 
                            target.tagName === 'H2';

      const isMediumTarget = target.closest('a') || 
                             target.closest('.project-item') || 
                             target.closest('button');
      
      if (isButton) {
        setCursorState('hover-button')
      } else if (isGiantTarget) {
        setCursorState('hover-giant')
      } else if (isMediumTarget) {
        setCursorState('hover-medium')
      } else {
        setCursorState('default')
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseover', handleOver)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseover', handleOver)
    }
  }, [mouseX, mouseY])

  const variants = {
    default: {
      width: 12,
      height: 12,
      opacity: 1
    },
    'hover-medium': {
      width: 60,
      height: 60,
      opacity: 1
    },
    'hover-giant': {
      width: 180,
      height: 180,
      opacity: 1
    },
    'hover-button': {
      width: 0,
      height: 0,
      opacity: 0
    }
  }

  return (
    <motion.div 
      className="cursor-main"
      style={{ left: springX, top: springY, x: '-50%', y: '-50%' }}
      animate={cursorState}
      variants={variants}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
    />
  )
}

function ParticleLandscape() {
  const count = 15000;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 60;
      const z = (Math.random() - 0.5) * 60;
      pos[i * 3] = x;
      pos[i * 3 + 1] = 0; // y will be animated
      pos[i * 3 + 2] = z;
    }
    return pos;
  }, []);

  const pointsRef = useRef<THREE.Points>(null!);
  const { mouse, viewport } = useThree();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const array = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = array[i3];
      const z = array[i3 + 2];
      
      // Undulating wave pattern
      array[i3 + 1] = Math.sin(x * 0.15 + time * 0.5) * 2 + Math.cos(z * 0.15 + time * 0.5) * 2 - 8;
      
      // Interactive repulse from mouse
      const dx = (mouse.x * viewport.width) / 2 - x;
      const dy = -8 - array[i3 + 1]; // Approximate y plane
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 5) {
        array[i3 + 1] -= (5 - dist) * 0.5;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.rotation.y = time * 0.05;
  });

  useGSAP(() => {
    gsap.to(pointsRef.current.position, {
      y: 5,
      scrollTrigger: {
        trigger: ".container",
        start: "top top",
        end: "bottom bottom",
        scrub: 1
      }
    })
  }, [])

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          count={count} 
          array={positions} 
          itemSize={3} 
          args={[positions, 3]} 
        />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#ffffff" transparent opacity={0.4} sizeAttenuation />
    </points>
  )
}

function Scene() {
  return (
    <>
      <color attach="background" args={['#050505']} />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 20, 10]} angle={0.15} penumbra={1} intensity={1.5} color="#ffffff" />
      <Environment preset="studio" />
      <ParticleLandscape />
    </>
  )
}

const PROJECTS = [
  { id: "01", title: "NOTIVEAPP", sub: "Productivity & Note Taking", desc: "A robust, cross-platform notes application leveraging Flutter and Riverpod for seamless state management.", link: "https://github.com/RaahimAlavi/notiveapp", image: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=600" },
  { id: "02", title: "WEATHERLY", sub: "Live Meteorology Dashboard", desc: "Real-time weather tracking featuring beautiful UI transitions, API integration, and location services.", link: "https://github.com/RaahimAlavi/Weatherly", image: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&q=80&w=600" },
  { id: "03", title: "X-RAYREALITY", sub: "Augmented Reality / UX", desc: "An experimental AR interface bridging digital information with physical environments.", link: "https://github.com/RaahimAlavi/X-RayReality", image: "https://ik.imagekit.io/raahimalavi/xrayreality" }
];

function ProjectImageFollower({ imageUrl }: { imageUrl: string | null }) {
  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)
  
  const springX = useSpring(mouseX, { stiffness: 400, damping: 30 })
  const springY = useSpring(mouseY, { stiffness: 400, damping: 30 })
  
  const turbulenceRef = useRef<SVGFETurbulenceElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  // Animate the SVG turbulence baseFrequency for continuous wave motion
  useEffect(() => {
    let animationFrameId: number;
    let startTime = performance.now();

    const animate = (time: number) => {
      if (turbulenceRef.current && imageUrl) {
        const elapsed = (time - startTime) / 1000;
        // Adjust the frequency over time to create a liquid/wave effect
        turbulenceRef.current.setAttribute('baseFrequency', `0.01 ${0.02 + Math.sin(elapsed * 2) * 0.01}`);
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [imageUrl]);

  return (
    <>
      {/* Hidden SVG Filter Definition */}
      <svg style={{ width: 0, height: 0, position: 'absolute' }}>
        <filter id="wave-distortion">
          <feTurbulence 
            ref={turbulenceRef}
            type="fractalNoise" 
            baseFrequency="0.01 0.02" 
            numOctaves="3" 
            result="noise" 
          />
          <feDisplacementMap 
            in="SourceGraphic" 
            in2="noise" 
            scale="20" 
            xChannelSelector="R" 
            yChannelSelector="G" 
          />
        </filter>
      </svg>

      <AnimatePresence>
        {imageUrl && (
          <motion.div
            className="wave-preview-container"
            style={{ left: springX, top: springY, x: 20, y: 20 }}
            initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotate: 2 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="wave-preview-screen">
              <img src={imageUrl} alt="Project Preview" className="wave-preview-image" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function App() {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // Simple 1s loader line intro
    const timer = setTimeout(() => setLoading(false), 1000)
    const lenis = new Lenis({ duration: 1.5, lerp: 0.1 })
    lenisRef.current = lenis
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
    return () => {
      clearTimeout(timer)
      lenis.destroy()
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true)
      } else {
        setShowScrollTop(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    if (lenisRef.current) {
      // Smoothly scroll to the absolute top
      lenisRef.current.scrollTo(0, { duration: 1.2, easing: (t) => 1 - Math.pow(1 - t, 4) });
    }
  }

  return (
    <main>
      <AnimatePresence>
        {loading && (
          <motion.div 
            className="loader-overlay"
            exit={{ y: '-100%' }}
            transition={{ duration: 1.2, ease: [0.83, 0, 0.17, 1] }}
          >
            <motion.div 
              className="loader-line"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, ease: "circOut" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="menu-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="menu-links">
              <a href="#projects" className="menu-link" onClick={() => setIsMenuOpen(false)}>works</a>
              <a href="#about" className="menu-link" onClick={() => setIsMenuOpen(false)}>about</a>
              <a href="#contact" className="menu-link" onClick={() => setIsMenuOpen(false)}>contact</a>
            </div>
            
            <div className="menu-socials">
              <a href="mailto:hello@raahim.me" className="social-circle" style={{ zIndex: 10 }}><MailIcon /></a>
              <a href="https://github.com/RaahimAlavi" target="_blank" rel="noreferrer" className="social-circle" style={{ zIndex: 10 }}><GithubIcon /></a>
              <a href="https://x.com/raahimidk" target="_blank" rel="noreferrer" className="social-circle" style={{ zIndex: 10 }}><XIcon /></a>
              <a href="https://linkedin.com/in/raahim-alavi-2ba730390" target="_blank" rel="noreferrer" className="social-circle" style={{ zIndex: 10 }}><LinkedinIcon /></a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ProjectImageFollower imageUrl={hoveredProject} />
      <CustomCursor />
      <div className="noise" />

      <div className="nav-top">
        <button className="logo" onClick={scrollToTop}>raahim alavi</button>
        <button 
          className="menu-trigger" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={isMenuOpen ? 'close' : 'menu'}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              style={{ display: 'block' }}
            >
              {isMenuOpen ? 'close' : 'menu'}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>

      <motion.div 
        className="canvas-container"
        animate={{
          filter: isMenuOpen ? 'blur(15px)' : 'blur(0px)',
          opacity: isMenuOpen ? 0.4 : 1,
        }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      >
        <Canvas dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
          <Scene />
        </Canvas>
      </motion.div>

      <motion.div
        className="container"
        animate={{
          filter: isMenuOpen ? 'blur(15px)' : 'blur(0px)',
          opacity: isMenuOpen ? 0.4 : 1,
        }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      >
          <section id="hero">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={loading ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.2 }}
            >
              <span className="spaced-text">flutter developer // ui/ux designer</span>
              <h1 className="hero-title">
                building<br/>digital<br/>exhibitions
              </h1>
              <div className="hero-footer">
                <p className="spaced-text">based in pakistan // global</p>
              </div>
            </motion.div>
          </section>

          <div className="marquee-container">
            <div className="marquee-content">
              Raahim Alavi • 2026 • Raahim Alavi • 2026 • Raahim Alavi • 2026 • Raahim Alavi • 2026 • Raahim Alavi • 2026 • Raahim Alavi • 2026 • Raahim Alavi • 2026 • Raahim Alavi • 2026 • Raahim Alavi • 2026
              • Raahim Alavi • 2026 • Raahim Alavi • 2026 • Raahim Alavi • 2026 • Raahim Alavi • 2026
            </div>
          </div>

          <section id="about">
            <span className="spaced-text">01 // identity</span>
            <div className="about-grid" style={{ marginTop: '5vh' }}>
              <h2 className="display-text">architect.<br/>creator.</h2>
              <div className="about-content">
                <p>I don’t just write code, I architect digital experiences. My dual expertise in Flutter and UI/UX allows me to envision a product's emotional impact and engineer it with flawless performance.</p>
                <p>I am passionate about pixel-perfect interfaces, robust state management, and delivering cross-platform solutions that feel native and intuitive.</p>
              </div>
            </div>
          </section>

          <section id="philosophy" style={{ minHeight: 'auto', padding: '5vh 0 15vh 0' }}>
            <h2 className="phil-huge-text" style={{ fontSize: 'clamp(4rem, 10vw, 12rem)', lineHeight: 0.85, letterSpacing: '-0.05em', textTransform: 'uppercase', marginBottom: '8vh' }}>
              <span className="phil-outline" style={{ color: 'transparent', WebkitTextStroke: '1px rgba(255, 255, 255, 0.4)' }}>ENGINEERING</span><br/>
              MEETS<br/>
              <span className="phil-outline" style={{ color: 'transparent', WebkitTextStroke: '1px rgba(255, 255, 255, 0.4)' }}>EMOTION.</span>
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
              <p style={{ fontSize: '1.2rem', lineHeight: '1.6', color: '#888' }}>
                <strong style={{ color: '#fff' }}>Development is a medium for expression.</strong><br/><br/>
                As a Flutter Developer and UI/UX Designer, I believe the best applications are built when engineering and design are a single, continuous loop of creation.
              </p>
              <p style={{ fontSize: '1.2rem', lineHeight: '1.6', color: '#888' }}>
                <strong style={{ color: '#fff' }}>Design is the language of interaction.</strong><br/><br/>
                By understanding hardware constraints and human psychology, I build resilient, scalable products that feel remarkably human. Whether architecting state-management systems or prototyping micro-interactions, my goal is to create software that resonates.
              </p>
            </div>
          </section>

          <section id="projects">
            <span className="spaced-text">02 // archive</span>
            <div className="projects-list">
              {PROJECTS.map((project) => (
                <a 
                  key={project.id} 
                  href={project.link} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="project-item" 
                  style={{textDecoration: 'none', color: 'inherit', display: 'flex', cursor: 'none'}}
                  onMouseEnter={() => setHoveredProject(project.image)}
                  onMouseLeave={() => setHoveredProject(null)}
                >
                  <span className="project-num spaced-text">{project.id}</span>
                  <div className="project-info" style={{flex: 1, marginLeft: '2rem'}}>
                    <h3>{project.title}</h3>
                    <span className="project-sub">{project.sub}</span>
                  </div>
                  <p className="project-desc" style={{flex: 1, textAlign: 'right'}}>{project.desc}</p>
                </a>
              ))}
            </div>
          </section>

          <section id="contact">
            <div className="contact-wrap">
              <span className="section-label">03 // inquiry</span>
              <h2 className="hero-title" style={{ fontSize: 'clamp(3rem, 15vw, 15rem)' }}>LET'S<br/>BUILD.</h2>
              <div style={{ marginTop: '3rem' }}>
                <a href="mailto:hello@raahim.me" className="btn-stylish" style={{ fontSize: '1.2rem', padding: '1.2rem 4rem' }}>hello@raahim.me</a>
              </div>
            </div>
          </section>

          <footer className="footer">
            <a href="https://x.com/raahimidk" target="_blank" rel="noreferrer" style={{color: 'inherit', textDecoration: 'none', cursor: 'none'}}>x</a>
            <a href="https://github.com/RaahimAlavi" target="_blank" rel="noreferrer" style={{color: 'inherit', textDecoration: 'none', cursor: 'none'}}>github</a>
            <a href="https://linkedin.com/in/raahim-alavi-2ba730390" target="_blank" rel="noreferrer" style={{color: 'inherit', textDecoration: 'none', cursor: 'none'}}>linkedin</a>
          </footer>
      </motion.div>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button 
            className="scroll-top-btn"
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            onClick={scrollToTop}
          >
            <ArrowUpIcon />
          </motion.button>
        )}
      </AnimatePresence>
    </main>
  )
}

export default App
