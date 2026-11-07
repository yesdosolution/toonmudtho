# 📌 SOURCE OF TRUTH: โครงการเว็บไซต์ "ตุ่นมุดท่อ" (Toon Mud Tho)
> **เอกสารฐานข้อมูลกลางประจำโครงการ (Single Source of Truth)**  
> ปรับปรุงล่าสุด: 7 พฤศจิกายน 2026 (Production v1.3)  
> *เอกสารนี้เป็นมาตรฐานอ้างอิงสูงสุดสำหรับ AI ทุกระบบ (ChatGPT, Claude, Gemini, Antigravity) และทีมนักพัฒนา*

---

## 1. ข้อมูลแบรนด์และช่องทางติดต่อจริง (Brand & Contact Info)
- **ชื่อแบรนด์:** ตุ่นมุดท่อ (Toon Mud Tho)
- **บริการหลัก:** บริการรับลอกท่อระบายน้ำ ลอกบ่อพักน้ำ ลอกและทำความสะอาดบ่อบำบัดน้ำเสียส่วนกลาง กำจัดโคลนเลนและสิ่งปฏิกูลในระบบระบายน้ำ สำหรับโครงการบ้านจัดสรร นิติบุคคล ไซต์ก่อสร้าง และบ้านพักอาศัย
- **เบอร์โทรศัพท์สายด่วน:** `062-701-0222` (ลิงก์บนเว็บต้องเป็น `tel:0627010222` เปิดแป้นโทรออกทันที)
- **LINE Official Account (LINE OA):** [https://lin.ee/WYiZBnO](https://lin.ee/WYiZBnO)
  - ⚠️ **กฎเหล็กเรื่อง LINE ID:** ห้ามแสดงข้อความไอดี `@tunnmudto` บนหน้าเว็บ เนื่องจากเจ้าของยังไม่ได้ซื้อ Premium ID และป้องกันลูกค้าค้นหาผิด
- **โดเมนหลักของธุรกิจ:** `https://toonmudtho.com`
- **อีเมลรับแจ้งเตือนลีด/ใบเสนอราคา:** `nanakornsuesat@gmail.com`

---

## 2. โครงสร้างระบบออนไลน์และคลาวด์ (Cloud & Infrastructure Architecture)

| ระบบงาน | ผู้ให้บริการ | รายละเอียด / ลิงก์ | บัญชีผู้ดูแล |
| :--- | :--- | :--- | :--- |
| **Git Repository** | GitHub | [github.com/yesdosolution/toonmudtho](https://github.com/yesdosolution/toonmudtho) | `yesdosolution` (Branch: `master`) |
| **Hosting & CDN** | Netlify Global CDN | [https://toonmudtho.netlify.app](https://toonmudtho.netlify.app) | Site ID: `98b1a9f5-bffd-4994-8ddf-318a51f3f41b` (Team: `yesdo-solution`) |
| **Domain Registrar** | Hostatom | `toonmudtho.com` | Nameservers ชี้มาที่ Netlify DNS |
| **Lead Form API** | Formspree | Endpoint: `https://formspree.io/f/mwlljeno` | ปลายทาง: `nanakornsuesat@gmail.com` |
| **Image Cloud Host** | TmpFiles / Cloud | API สำหรับเก็บภาพถ่ายหน้างานชั่วคราว พร้อมลิงก์ดาวน์โหลดตรง | อัตโนมัติผ่าน Client-side Script |

---

## 3. สถาปัตยกรรมโค้ด (Technical Architecture)
- **เทคโนโลยี:** Pure Modern Web (HTML5, Vanilla CSS3, Vanilla ES6+ JavaScript)
- **โครงสร้างไฟล์ในโปรเจกต์:**
  - `web/index.html` — โครงสร้างหน้าเว็บ Single Page Application แบบ Semantic HTML
  - `web/assets/css/styles.css` — ดีไซน์ระบบ Responsive Design, CSS Grid/Flexbox, WCAG AAA Contrast
  - `web/assets/js/app.js` — การทำงานของ Client-side Image Compression, Menu, Modal, Formspree API, Clean URL
  - `web/assets/brand/` — ไฟล์ภาพแบรนด์ โลโก้ และมาสคอตตุ่นมุดท่อ
  - `web/assets/images/real/` — รูปถ่ายหน้างานจริง 100% (งานทีมงาน, งานหมู่บ้าน, บ่อพัก, เครื่องมือเปิดฝาบ่อ)
  - `netlify.toml` — การกำหนดค่า Build/Publish Directory ของ Netlify (`publish = "web"`)

---

## 4. มาตรฐานฟังก์ชันสำคัญ (Key Functional Specifications)

### 4.1 ระบบจัดการรูปภาพและฟอร์มเสนอราคา (Dual-Channel Lead Flow)
1. **Client-Side Canvas Compression:** เมื่อลูกค้าเลือกรูปถ่ายจากกล้องมือถือ (ไฟล์ 10-20 MB) สคริปต์ในเบราว์เซอร์จะทำการลดขนาดและบีบอัดลงเหลือประมาณ **200-400 KB (JPEG Quality 0.82)** ในเวลาไม่ถึง 0.3 วินาที
2. **Cloud Image Link:** รูปภาพที่ถูกบีบอัดจะถูกอัปโหลดขึ้น Cloud และแปลงเป็นลิงก์ภาพความละเอียดสูง (Direct Link)
3. **Formspree Notification:** ข้อมูลชื่อ, เบอร์โทร, ทำเลที่ตั้ง, ประเภทงาน พร้อมลิงก์รูปภาพ ถูกยิงเข้า `https://formspree.io/f/mwlljeno` ส่งแจ้งเตือนตรงเข้าอีเมล `nanakornsuesat@gmail.com` ทันที
4. **Instant LINE Conversion:** เมื่อส่งข้อมูลแล้ว หน้าเว็บจะสร้างข้อความสรุปงานและแสดงปุ่ม **"เปิด LINE เพื่อวางข้อความ"** ให้ลูกค้ากดส่งต่อในแชท [https://lin.ee/WYiZBnO](https://lin.ee/WYiZBnO) ได้ทันที

### 4.2 ระบบ Clean URL (No Hash Pollution)
- ไม่มีแท็ก `#hero` หรือ Hash ค้างในแถบ URL เบราว์เซอร์
- เมื่อคลิกโลโก้หรือเมนูนำทาง หน้าจอจะเลื่อนแบบ Smooth Scroll โดย URL จะรักษาความสะอาดอยู่ที่ `https://toonmudtho.com/` ตลอดเวลา

### 4.3 Hero Section & ผลงาน 17 โครงการ
- **Hero Image:** ใช้รูปถ่ายทีมงานจริง 9 ท่านพร้อมกรวยจราจร สัดส่วน 16:9 (`hero-team-16-9.webp` / `.jpg`) ไม่บดบังปุ่ม CTA และจัดตำแหน่งแคปชันไม่ให้บังตัวบุคคลบนมือถือ
- **Portfolio Section:** รวมผลงาน 17 โครงการบ้านจัดสรรชั้นนำ (เพลโน่, ศุภาลัย, สราญสิริ, อณาสิริ, พรีโม่ ฯลฯ) พร้อมปุ่มสลับข้อความ *"ดูโครงการอื่นๆของเรา"* และ *"ย่อแสดงผลงาน"*

---

## 5. การตั้งค่า DNS ที่ Hostatom (Hostatom Setup Guide)
ในการชี้โดเมน `toonmudtho.com` มาที่ Netlify:
1. ปิดใช้งาน **Registrar Lock** ในหน้าจัดการโดเมน Hostatom
2. กดยืนยันอีเมลผู้ถือครองโดเมน (ICANN Verification) จาก Hostatom เพื่อปลดสถานะ `client hold`
3. ตั้งค่า **Nameservers ที่กำหนดเอง** เป็น:
   - `Nameserver 1`: `dns1.p02.nsone.net`
   - `Nameserver 2`: `dns2.p02.nsone.net`
   - `Nameserver 3`: `dns3.p02.nsone.net`
   - `Nameserver 4`: `dns4.p02.nsone.net`
