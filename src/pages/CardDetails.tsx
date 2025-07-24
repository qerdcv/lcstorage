import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import type { Card } from '@models/card';
import db from '@/db';
import { QRCodeSVG } from 'qrcode.react';
import JsBarcode from 'jsbarcode';

function Barcode({ value }: { value: string }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current) {
      JsBarcode(svgRef.current, value, {
        format: "CODE128", // or EAN13, UPC, etc.
        displayValue: true,
        width: 2,
        height: 50,
      });
    }
  }, [value]);

  return <svg ref={svgRef} />;
}

function CardDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [card, setCard] = useState<Card | undefined>(undefined);

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
    <>
      <h1>{card.name}</h1>
      {card.format == 'qr_code' ? <QRCodeSVG value={card.code} /> : <Barcode value={card.code} />}
    </>
  )
}

export default CardDetailsPage;