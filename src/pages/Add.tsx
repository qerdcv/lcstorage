import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router';
import {
  Html5Qrcode,
  Html5QrcodeSupportedFormats,
} from "html5-qrcode";
import { CircleOff } from 'lucide-react';
import db from '@/db';

export default function AddCardForm() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [format, setFormat] = useState("CODE128");
  const [showScanner, setShowScanner] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const regionId = "qr-reader";

  // Start the scanner
  useEffect(() => {
    if (!showScanner) return;

    const scanner = new Html5Qrcode(regionId, {
      formatsToSupport: [
        Html5QrcodeSupportedFormats.QR_CODE,
        Html5QrcodeSupportedFormats.CODE_128,
        Html5QrcodeSupportedFormats.CODE_39,
        Html5QrcodeSupportedFormats.EAN_13,
        Html5QrcodeSupportedFormats.UPC_A,
        Html5QrcodeSupportedFormats.ITF,
      ],
      verbose: false,
    });
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: "environment" },
        { fps: undefined, },
        (decodedText, decodedResult) => {
          setCode(decodedText);
          const newFormat = decodedResult.result?.format?.formatName.toUpperCase().replace("_", "") || "CODE128";
          setFormat(newFormat);
          handleCloseScanner(); // Close properly
        },
        (_: any) => { },
      )
      .catch(console.error);

    return () => {
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .then(() => scannerRef.current?.clear())
          .catch(console.error)
          .finally(() => {
            scannerRef.current = null;
          });
      }
    };
  }, [showScanner]);

  const handleCloseScanner = async () => {
    const scanner = scannerRef.current;
    if (scanner) {
      try {
        await scanner.stop();
        scanner.clear();
      } catch (err) {
        console.error("Failed to stop scanner:", err);
      } finally {
        scannerRef.current = null;
        setShowScanner(false);
      }
    } else {
      setShowScanner(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await db.addCard({ name, code, format: format })
    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-4">
      <div>
        <label className="block font-semibold mb-1">Card Name</label>
        <input
          type="text"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Card Code</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={code}
            required
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded"
          />
          <button
            type="button"
            onClick={() => setShowScanner(true)}
            className="px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200"
          >
            Scan
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Add Card
      </button>

      {showScanner && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-md relative">
            <button
              type="button"
              onClick={handleCloseScanner}
              className="absolute top-1 right-2 text-xl"
            >
              <CircleOff size={24} className="text-gray-600" />
            </button>
            <div id={regionId} className="w-[300px] h-[300px]" />
          </div>
        </div>
      )}
    </form>
  );
}