import { useRef, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Stars } from '@react-three/drei'
import * as THREE from 'three'

function JetModel({ scrollY }) {
    const groupRef = useRef()
    const { scene } = useGLTF('/models/jet.glb')

    useEffect(() => {
        if (scene) {
            const box = new THREE.Box3().setFromObject(scene)
            const center = box.getCenter(new THREE.Vector3())
            scene.position.set(-center.x, -center.y, -center.z)

            scene.traverse((child) => {
                if (child.isMesh) {
                    child.material = new THREE.MeshStandardMaterial({
                        color: '#dce8f5',
                        metalness: 0.92,
                        roughness: 0.08,
                        envMapIntensity: 1.5,
                    })
                }
            })
        }
    }, [scene])

    useFrame(() => {
        if (!groupRef.current) return

        const scroll = scrollY.current
        const s = Math.min(scroll / 1500, 1)

        let targetX, targetY, targetZ, targetRotY, targetRotZ

        if (s < 0.45) {
            const p = s / 0.45
            targetX = 0
            targetY = 0
            targetZ = -4 + p * 5
            targetRotY = 0
            targetRotZ = 0
        } else if (s < 0.82) {
            const p = (s - 0.45) / 0.37
            targetX = -p * 10
            targetY = p * 0.5
            targetZ = 1 - p * 3
            targetRotY = -p * 1.4
            targetRotZ = -p * 0.35
        } else {
            targetX = -10
            targetY = 0.5
            targetZ = -2
            targetRotY = -1.4
            targetRotZ = -0.35
        }

        groupRef.current.position.x += (targetX - groupRef.current.position.x) * 0.055
        groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.055
        groupRef.current.position.z += (targetZ - groupRef.current.position.z) * 0.055
        groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * 0.055
        groupRef.current.rotation.z += (targetRotZ - groupRef.current.rotation.z) * 0.055
    })

    // Scale: make max dimension = 3 units. 3 / 22.73 = 0.132
    return (
        <group ref={groupRef} position={[0, 0, -4]} scale={0.132}>
            <primitive object={scene} />
        </group>
    )
}

export default function ThreeJetHero() {
    const scrollY = useRef(0)

    useEffect(() => {
        const handleScroll = () => {
            scrollY.current = window.scrollY
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <Canvas
            camera={{ position: [0, 0.5, 5], fov: 50 }}
            gl={{
                antialias: true,
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: 1.5,
                alpha: true,
            }}
            style={{ background: 'transparent', width: '100%', height: '100%' }}
        >
            <Suspense fallback={null}>
                <Stars radius={120} depth={60} count={5000} factor={4} saturation={0} fade speed={0.5} />
                <ambientLight intensity={0.8} color="#ffffff" />
                <directionalLight position={[10, 10, 5]} color="#ffffff" intensity={4} />
                <directionalLight position={[-8, 4, -5]} color="#D4AF37" intensity={2} />
                <pointLight position={[0, 5, 8]} color="#b0c4ff" intensity={2} distance={25} />
                <pointLight position={[0, -3, 3]} color="#ffffff" intensity={1} distance={15} />
                <JetModel scrollY={scrollY} />
            </Suspense>
        </Canvas>
    )
}