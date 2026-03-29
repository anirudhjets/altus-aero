import { useRef, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Stars } from '@react-three/drei'
import * as THREE from 'three'

function JetModel({ progress }) {
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
                    })
                }
            })
        }
    }, [scene])

    useFrame(() => {
        if (!groupRef.current) return
        const p = progress.current

        // Phase 1 (0-0.6): jet flies from far toward camera
        // Phase 2 (0.6-0.85): jet is huge filling screen, slicing through text
        // Phase 3 (0.85-1.0): jet fades out and disappears

        let targetZ, targetY, scale, opacity

        if (p < 0.6) {
            const t = p / 0.6
            targetZ = 8 - t * 10
            targetY = -0.3
            scale = 0.02 + t * 0.18
            opacity = 1
        } else if (p < 0.85) {
            const t = (p - 0.6) / 0.25
            targetZ = -2 - t * 2
            targetY = -0.3 + t * 0.3
            scale = 0.2 + t * 0.15
            opacity = 1
        } else {
            const t = (p - 0.85) / 0.15
            targetZ = -4 - t * 3
            targetY = 0
            scale = 0.35
            opacity = 1 - t
        }

        groupRef.current.position.z += (targetZ - groupRef.current.position.z) * 0.07
        groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.07
        groupRef.current.scale.setScalar(scale)

        // Fade out at the end
        groupRef.current.traverse((child) => {
            if (child.isMesh && child.material) {
                child.material.transparent = true
                child.material.opacity = opacity
            }
        })
    })

    return (
        <group ref={groupRef} position={[0, -0.3, 8]}>
            <primitive object={scene} />
        </group>
    )
}

export default function ThreeJetHero({ progress }) {
    return (
        <Canvas
            camera={{ position: [0, 0.5, 5], fov: 45 }}
            gl={{
                antialias: true,
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: 1.6,
                alpha: true,
            }}
            style={{ background: 'transparent', width: '100%', height: '100%' }}
        >
            <Suspense fallback={null}>
                <Stars radius={120} depth={60} count={5000} factor={4} saturation={0} fade speed={0.5} />
                <ambientLight intensity={0.9} color="#ffffff" />
                <directionalLight position={[10, 10, 5]} color="#ffffff" intensity={5} />
                <directionalLight position={[-8, 4, -5]} color="#D4AF37" intensity={2} />
                <pointLight position={[0, 5, 3]} color="#b0c4ff" intensity={2} distance={20} />
                <pointLight position={[0, -3, 2]} color="#ffffff" intensity={1} distance={10} />
                <JetModel progress={progress} />
            </Suspense>
        </Canvas>
    )
}
