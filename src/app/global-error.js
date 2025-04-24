'use client';
 
export default function GlobalError({ error }) {
  return (
    <html>
      <body>
        <div className="container text-center py-5">
          <h1 className="mb-4">เกิดข้อผิดพลาด</h1>
          <p>ขออภัย เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่อีกครั้ง</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary mt-3">
            ลองใหม่
          </button>
        </div>
      </body>
    </html>
  );
}
