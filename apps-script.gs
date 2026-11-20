/**
 * Google Apps Script — ระบบ P4P (รพ.ศรีสังวรสุโขทัย)
 * ไฟล์นี้เก็บไว้ใน GitHub เพื่ออ้างอิง/เวอร์ชัน — ตัวจริงต้องวางในโปรเจกต์ Apps Script
 * ที่ผูกกับชีต แล้ว Deploy เป็น Web app (/exec) ให้ได้ URL เดิมที่แอปใช้อยู่:
 *   https://script.google.com/macros/s/AKfycbymOlSYbZnGgVOcCULjKK6dbOrrFCmcsKEBN9vD8qGIPgKGQepFLwFNgH8vQ1Epgt7mZQ/exec
 *
 * การ Deploy:
 *   Deploy → Manage deployments → Edit (ดินสอ) deployment เดิม → Version: New version → Deploy
 *   Execute as: Me | Who has access: Anyone   (อย่าสร้าง deployment ใหม่ ไม่งั้น URL เปลี่ยน)
 *
 * หมายเหตุ:
 *   - doGet  : ใช้ดึงงบรายเดือน (JSONP) ให้หน้าเว็บ index.html — อ่านแท็บ "นับหน่วยย่อย-<เดือน>" ด้วยชื่อ
 *   - doPost : ของเดิมที่หน้าเว็บใช้บันทึก (add_criteria/update_criteria/delete_* ฯลฯ)
 *     ถ้าในโปรเจกต์มี doGet/doPost อยู่แล้ว ให้ "รวม" logic เข้าด้วยกัน อย่าให้ชื่อฟังก์ชันซ้ำ
 */

var P4P_SPREADSHEET_ID = '1N-zsUJruW7F50CoUElf0YeFg9cVA2TU4ORFjpyljPJo';

/**
 * doGet — รองรับ action=get_month_budget (JSONP)
 * เรียกจากหน้าเว็บ: {EXEC_URL}?action=get_month_budget&month=<เดือนไทย>&callback=<fn>
 * คืนค่า: callbackFn({ ok:true, name:"นับหน่วยย่อย-<เดือน>", rows:[[...],[...]] })
 */
function doGet(e) {
  var cb = (e && e.parameter && e.parameter.callback) ? e.parameter.callback : 'callback';
  var out = { ok: false };
  try {
    if (e.parameter.action === 'get_month_budget') {
      var name = 'นับหน่วยย่อย-' + (e.parameter.month || '');
      var ss = SpreadsheetApp.openById(P4P_SPREADSHEET_ID);
      var sh = ss.getSheetByName(name);
      out = sh
        ? { ok: true, name: name, rows: sh.getDataRange().getValues() }
        : { ok: false, error: 'no_sheet', name: name };
    } else {
      out = { ok: false, error: 'unknown_action' };
    }
  } catch (err) {
    out = { ok: false, error: String(err) };
  }
  return ContentService
    .createTextOutput(cb + '(' + JSON.stringify(out) + ')')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

/* ------------------------------------------------------------------
 * doPost (โครงอ้างอิง) — ของเดิมที่หน้าเว็บใช้บันทึกข้อมูลลงชีต
 * ถ้าโปรเจกต์ของคุณมี doPost อยู่แล้ว ให้ใช้ของเดิม (อย่าวางทับให้ซ้ำ)
 * วางไว้เป็นแนวทางเฉย ๆ — action ที่หน้าเว็บส่งมา:
 *   add_criteria, update_criteria, delete_criteria,
 *   delete_department, (และอื่น ๆ ตามที่ใช้งาน)
 * ------------------------------------------------------------------
function doPost(e) {
  var data = {};
  try { data = JSON.parse(e.postData.contents); } catch (err) {}
  var ss = SpreadsheetApp.openById(P4P_SPREADSHEET_ID);
  var sh = ss.getSheetByName('ค่าตัว');
  switch (data.action) {
    case 'update_criteria':
      // data.rowId (index แถว), data.group, data.values[]
      // ... เขียนทับแถวตามโครงชีตจริงของคุณ ...
      break;
    case 'add_criteria':
      // sh.appendRow([data.group].concat(data.values));
      break;
    // case 'delete_criteria': ...
    // case 'delete_department': ...
  }
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
------------------------------------------------------------------ */
