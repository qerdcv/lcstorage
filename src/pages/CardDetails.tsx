import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import type { ICard } from '@models/card';
import db from '@/db';
import { QRCodeSVG } from 'qrcode.react';
import JsBarcode from 'jsbarcode';

function Barcode({ value, codeFormat }: { value: string, codeFormat: string }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current) {
      JsBarcode(svgRef.current, value, {
        format: codeFormat,
        displayValue: true,
        fontSize: 16,
        height: 100,
        margin: 10,
      });
    }
  }, [value]);

  return <svg ref={svgRef} />;
}

function CardDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [card, setCard] = useState<ICard | undefined>(undefined);

  useEffect(() => {
    const fetchCard = async () => {
      setCard(await db.getCard(Number(id)));
      setLoading(false);
    };
    fetchCard();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!card) {
    return <p>Card not found.</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center space-y-6">
      <h1 className="text-2xl font-bold">{card.name}</h1>
      {card.format === "QRCODE" ? (
        <QRCodeSVG value={card.code} size={256} />
      ) : (
        <Barcode
          value={card.code}
          codeFormat={card.format}
        />
      )}
    </div>
  )
}

export default CardDetailsPage;