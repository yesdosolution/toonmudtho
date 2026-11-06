# เว็บไซต์บริการลอกท่อระบายน้ำและบ่อพัก "ตุ่นมุดท่อ" (Toon Mud Tho)

เว็บไซต์หน้าเดียว (Modern Static Landing Page) ระดับโปรดักชัน สำหรับธุรกิจบริการลอกท่อระบายน้ำ ลอกบ่อพักน้ำ กำจัดโคลนเลนและสิ่งปฏิกูลในท่อ สำหรับโครงการบ้านจัดสรร นิติบุคคล ไซต์ก่อสร้าง และบ้านพักอาศัย

- **Live Production URL:** [https://toonmudtho.netlify.app](https://toonmudtho.netlify.app)
- **Target Custom Domain:** [https://toonmudtho.com](https://toonmudtho.com)
- **LINE Official Account:** [https://lin.ee/WYiZBnO](https://lin.ee/WYiZBnO)
- **Hotline:** `062-701-0222`

---

## 📚 เอกสารสำคัญในคลังข้อมูล (Documentation)

- [**SOURCE_OF_TRUTH.md**](./SOURCE_OF_TRUTH.md) — ฐานข้อมูลกลางอ้างอิงสถาปัตยกรรมระบบ ข้อมูลแบรนด์ และการตั้งค่าคลาวด์ทั้งหมด
- [**HANDOFF.md**](./HANDOFF.md) — เอกสารส่งมอบงานสำหรับ Control Tower สรุปสถานะล่าสุดและสิ่งที่ต้องดำเนินการต่อ
- [**AI_PROJECT_CONTEXT.md**](./AI_PROJECT_CONTEXT.md) — ข้อมูลบริบทภาพรวมโปรเจกต์สำหรับใช้เชื่อมต่อกับ AI ทุกค่าย

---

## 🚀 สถาปัตยกรรมเทคนิค (Tech Stack)

- **Frontend:** Pure Semantic HTML5, Vanilla CSS3 (Custom Responsive Grid / WCAG AAA Contrast), Vanilla ES6+ JavaScript
- **Hosting & CI/CD:** Netlify Global CDN
- **Lead Generation & Email:** Formspree API (`https://formspree.io/f/mwlljeno`) ส่งแจ้งเตือนตรงเข้า `nanakornsuesat@gmail.com`
- **Image Processing:** Client-Side HTML5 Canvas Compression (บีบอัดรูปถ่ายมือถือ 15MB -> 300KB ก่อนส่ง)
- **Image Cloud:** อัปโหลดขึ้น Cloud และส่งเป็นลิงก์ภาพความละเอียดสูงในอีเมลแจ้งเตือน
- **Clean URL Engine:** ควบคุมการนำทางแบบ Smooth Scroll โดยรักษา URL ให้สะอาดอยู่ที่ `https://toonmudtho.com/` ไม่มี `#hero` ตกค้าง
