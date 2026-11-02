// Optional requirement: Confirmed / Completed booking er PDF receipt (client-side, jsPDF)
export async function downloadInvoice(b) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const left = 48;
  let y = 64;
  const line = (label, value) => {
    doc.setFont('helvetica', 'bold').setFontSize(11).text(label, left, y);
    doc.setFont('helvetica', 'normal').text(String(value), left + 150, y);
    y += 22;
  };

  doc.setFont('helvetica', 'bold').setFontSize(24).text('StudioSpace', left, y);
  doc
    .setFontSize(11)
    .setFont('helvetica', 'normal')
    .text('Booking Invoice', 460, y);
  y += 14;
  doc.setDrawColor(147, 51, 234).setLineWidth(2).line(left, y, 547, y);
  y += 32;

  line('Invoice no.', `SS-${String(b._id).slice(-8).toUpperCase()}`);
  line(
    'Issued on',
    new Date().toLocaleDateString('en-US', { dateStyle: 'long' }),
  );
  line('Status', b.status);
  y += 12;
  line('Studio', b.studioTitle);
  line('Location', b.studioLocation || '-');
  line('Host', b.ownerName || b.ownerEmail);
  y += 12;
  line('Booked by', b.userName);
  line('Email', b.userEmail);
  y += 12;
  line('Date', b.date);
  line(
    'Time',
    `${b.startTime} - ${b.endTime} (${b.hours} ${b.hours === 1 ? 'hour' : 'hours'})`,
  );
  line('Hourly rate', `$${b.hourlyRate}`);
  line('Security deposit', `$${b.securityDeposit} (refundable)`);
  y += 8;
  doc.setDrawColor(200).setLineWidth(0.5).line(left, y, 547, y);
  y += 28;
  doc
    .setFont('helvetica', 'bold')
    .setFontSize(15)
    .text('Total paid for studio time', left, y);
  doc.text(`$${b.total}`, 547, y, { align: 'right' });
  y += 48;
  doc.setFont('helvetica', 'normal').setFontSize(10).setTextColor(120);
  doc.text(
    'Thank you for booking with StudioSpace. This receipt was generated automatically.',
    left,
    y,
  );

  doc.save(`studiospace-invoice-${String(b._id).slice(-8)}.pdf`);
}
