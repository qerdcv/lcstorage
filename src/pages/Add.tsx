import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Html5Qrcode, Html5QrcodeSupportedFormats, type Html5QrcodeResult } from "html5-qrcode";

import DB from '@/db';

export default function AddPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [format, setFormat] = useState<string | undefined>(undefined);
  const codeInputRef = useRef<HTMLInputElement>(null);
  const html5QrcodeRef = useRef<Html5Qrcode | null>(null);
  const [scannerVisible, setScannerVisible] = useState(false);

  const startScanner = () => {
    if (html5QrcodeRef.current) return; // already started

    setScannerVisible(true);

    // The ID of the element where the camera feed will be rendered
    const qrCodeRegionId = "reader";

    // Create instance
    html5QrcodeRef.current = new Html5Qrcode(qrCodeRegionId, {
      formatsToSupport: [
        Html5QrcodeSupportedFormats.QR_CODE,
        Html5QrcodeSupportedFormats.CODE_128,
      ],
      verbose: false,
    });

    html5QrcodeRef.current
      .start(
        { facingMode: "environment" }, // camera config
        {
          fps: 10,
          qrbox: 250,
        },
        (decodedText, result: Html5QrcodeResult) => {
          console.log("QR Code scanned:", decodedText);
          setCode(decodedText);
          setFormat(result.result.format?.formatName);
          if (codeInputRef.current) {
            codeInputRef.current.value = decodedText;
          }
          stopScanner();
        },
        (errorMessage) => {
          console.warn("QR Code scan error:", errorMessage);
        }
      )
      .catch((err) => {
        console.error("Unable to start scanning:", err);
        setScannerVisible(false);
      });
  };

  const stopScanner = () => {
    if (!html5QrcodeRef.current) return;

    html5QrcodeRef.current
      .stop()
      .then(() => {
        html5QrcodeRef.current?.clear();
        html5QrcodeRef.current = null;
        setScannerVisible(false);
      })
      .catch((err) => {
        console.error("Failed to stop scanning:", err);
      });
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement)?.value;
    const formCode = (form.elements.namedItem("code") as HTMLInputElement)?.value || code;
    await DB.addCard({ name, format: format || "code_128", code: formCode });
    navigate("/");
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <label htmlFor="name">Card Name:</label>
        <input type="text" id="name" name="name" required />

        <label htmlFor="code">Card Code:</label>
        <input
          type="text"
          id="code"
          name="code"
          required
          ref={codeInputRef}
          defaultValue={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <button type="submit">Add Card</button>
      </form>

      {!scannerVisible && (
        <button onClick={startScanner} style={{ marginTop: "20px" }}>
          Scan QR Code
        </button>
      )}

      <div id="reader" style={{ width: "300px", marginTop: "20px" }}></div>

      {scannerVisible && (
        <button onClick={stopScanner} style={{ marginTop: "10px" }}>
          Stop Scanner
        </button>
      )}
    </div>
  );
}