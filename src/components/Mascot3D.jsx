import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

useGLTF.preload('/src/assets/694e4775ca696e5f2f68d386.glb');

const Model = ({ isSpeaking }) => {
    const { scene } = useGLTF('/src/assets/694e4775ca696e5f2f68d386.glb');
    const modelRef = useRef();
    const morphMeshes = useRef([]);
    const headBone = useRef(null);
    const jawBone = useRef(null);
    const leftArm = useRef(null);
    const rightArm = useRef(null);

    useEffect(() => {
        const meshes = [];
        scene.traverse((child) => {
            if (child.isMesh && child.morphTargetDictionary) meshes.push(child);
            if (child.isBone) {
                const name = child.name.toLowerCase();
                if (name.includes('jaw') || name.includes('teeth')) jawBone.current = child;
                if (name.includes('head')) headBone.current = child;
                if (name.includes('left') && (name.includes('forearm') || name.includes('arm'))) leftArm.current = child;
                if (name.includes('right') && (name.includes('forearm') || name.includes('arm'))) rightArm.current = child;
            }
        });
        morphMeshes.current = meshes;
    }, [scene]);

    useFrame((state) => {
        const time = state.clock.elapsedTime;

        // Head Tracking: Look at mouse/camera
        if (headBone.current) {
            headBone.current.rotation.y = THREE.MathUtils.lerp(headBone.current.rotation.y, state.mouse.x * 0.3, 0.1);
            // +0.1 tilts head down slightly
            headBone.current.rotation.x = THREE.MathUtils.lerp(headBone.current.rotation.x, -state.mouse.y * 0.2 + 0.1, 0.1);
        }

        const val = isSpeaking ? (Math.sin(time * 20) * 0.5 + 0.5) * 0.8 : 0;

        // Lip Sync & Jaw
        morphMeshes.current.forEach(m => {
            // Animate Morph Target 0 (usually mouth open)
            if (m.morphTargetInfluences && m.morphTargetInfluences.length)
                m.morphTargetInfluences[0] = isSpeaking ? val : THREE.MathUtils.lerp(m.morphTargetInfluences[0], 0, 0.2);
        });
        if (jawBone.current) {
            jawBone.current.rotation.x = isSpeaking ? (val * 0.2 + 0.1) : THREE.MathUtils.lerp(jawBone.current.rotation.x, 0, 0.2);
        }

        // Arm Gestures (Explaining)
        if (isSpeaking) {
            if (leftArm.current) {
                // Raise and wave left arm slightly
                leftArm.current.rotation.z = Math.sin(time * 2.5) * 0.1 + 0.6;
                leftArm.current.rotation.x = Math.sin(time * 4) * 0.1;
            }
            if (rightArm.current) {
                // Mirror right arm
                rightArm.current.rotation.z = -Math.sin(time * 3) * 0.1 - 0.6;
                rightArm.current.rotation.x = Math.cos(time * 3.5) * 0.1;
            }
        } else {
            // Reset to idle
            if (leftArm.current) {
                leftArm.current.rotation.z = THREE.MathUtils.lerp(leftArm.current.rotation.z, 0.15, 0.05);
                leftArm.current.rotation.x = THREE.MathUtils.lerp(leftArm.current.rotation.x, 0, 0.05);
            }
            if (rightArm.current) {
                rightArm.current.rotation.z = THREE.MathUtils.lerp(rightArm.current.rotation.z, -0.15, 0.05);
                rightArm.current.rotation.x = THREE.MathUtils.lerp(rightArm.current.rotation.x, 0, 0.05);
            }
        }

        // Ensure body doesn't rotate whole model
        if (modelRef.current) modelRef.current.rotation.set(0, 0, 0);
    });

    // Scale 2.5 = Upper Body. Position -3.5 = Center Chest/Head in view.
    return <primitive object={scene} ref={modelRef} scale={2.5} position={[0, -3.5, 0]} />;
};

const Mascot3D = ({ isSpeaking }) => {
    return (
        <div className="w-full h-full relative">
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0.2, 3.5]} />
                <ambientLight intensity={1.3} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <spotLight position={[0, 10, 5]} angle={0.5} penumbra={1} intensity={2} />
                <Model isSpeaking={isSpeaking} />
                <Environment preset="city" />
                <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
            </Canvas>
        </div>
    );
};

export default Mascot3D;
