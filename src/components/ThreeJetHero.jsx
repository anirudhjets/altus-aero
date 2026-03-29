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

        // Jet starts far away (z=4) and flies toward and past camera (z=-18)
        const targetZ = 4 - p * 22
        const targetY = -0.5 + p * 0.5

        groupRef.current.position.z += (targetZ - groupRef.current.position.z) * 0.08
        groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.08

        // Grows larger as it approaches
        const scale = 0.05 + p * 0.25
        groupRef.current.scale.setScalar(scale)
    })

    return (
        <group ref={groupRef} position={[0, -0.5, 4]}>
            <primitive object={scene} />
        </group>
    )
}

export default function ThreeJetHero({ progress }) {
    return (
        <Canvas
            camera={{ position: [0, 0, 5], fov: 50 }}
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
                <JetModel progress={progress} />
            </Suspense>
        </Canvas>
    )
}
