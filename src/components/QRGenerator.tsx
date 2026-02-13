import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { GenerateAttendanceResponse } from "../types/attendance";

interface QRGeneratorProps {
  data: GenerateAttendanceResponse;
}

export default function QRGenerator({ data }: QRGeneratorProps) {
  // url base64
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  useEffect(() => {
    QRCode.toDataURL(JSON.stringify(data))
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error("Error generating QR code:", err));
  }, [data]);

  return (
    <div style={{ textAlign: "center", margin: "20px" }}>
      <h3>QR Code Anda</h3>
      {qrCodeUrl && (
        <img
          src={qrCodeUrl}
          alt="QR Code"
          style={{ width: "200px", height: "200px" }}
        />
      )}
      <p>Scan untuk absen</p>
    </div>
  );
}
