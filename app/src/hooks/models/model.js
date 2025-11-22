import { useBox } from "@react-three/cannon";
import { useGLTF } from "@react-three/drei";

const Model = ({ position = [0, 0, 0] }) => {
  const { scene } = useGLTF("/shouji.glb"); // 🔥 モデルをロード

  // 🔹 左の壁
  const [leftWallRef] = useBox(() => ({
    mass: 0, // 静的オブジェクト
    position: [-5, 5, 0], // 左壁の位置
    args: [0.1, 10, 20], // 幅、高さ、奥行き
  }));

  // 🔹 右の壁
  const [rightWallRef] = useBox(() => ({
    mass: 0,
    position: [14, 5, 0], // 右壁の位置
    args: [0.1, 10, 20],
  }));

  // 🔹 前の壁
  const [frontWallRef] = useBox(() => ({
    mass: 0,
    position: [5, 5, -10], // 前壁の位置
    args: [19, 10, 0.1],
  }));

  // 🔹 後ろの壁
  const [backWallRef] = useBox(() => ({
    mass: 0,
    position: [5, 5, 10], // 後壁の位置
    args: [19, 10, 0.1],
  }));

	const [ceilingRef] = useBox(() => ({
    mass: 0,
    position: [5, 8, 0],
    args: [20, 0.1, 20],
  }));

	console.log(position)

  return (
    <>
      {/* GLTFモデル */}
      <primitive object={scene} position={position} />
      
      {/* 壁の当たり判定（見えない） */}
      <mesh>

      </mesh>


    </>
  );
};

export default Model;
