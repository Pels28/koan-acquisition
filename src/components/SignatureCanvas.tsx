import SignatureCanvas from 'react-signature-canvas';
import { useRef } from 'react';

export default function SignatureForm() {
  const sigPad = useRef<SignatureCanvas>(null);

  const clear = () => sigPad.current?.clear();
  const save = () => {
    const signatureImage = sigPad.current?.getTrimmedCanvas().toDataURL("image/png");
    console.log("Signature saved:", signatureImage);
  };

  return (
    <div>
      <h2 className="text-xl font-bold">Please Sign Below</h2>
      <div className="border p-2 mt-2">
        <SignatureCanvas
          penColor="black"
          canvasProps={{ width: 500, height: 200, className: 'border' }}
          ref={sigPad}
        />
      </div>
      <div className="mt-4 space-x-2">
        <button onClick={save} className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
        <button onClick={clear} className="bg-gray-500 text-white px-4 py-2 rounded">Clear</button>
      </div>
    </div>
  );
}
