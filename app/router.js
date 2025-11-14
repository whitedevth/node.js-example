// นำเข้า express เพิ่อสร้าง router
const express = require('express');

// น้ำเข้า user feature เพื่อการทำงานสำหรับ user
const user = require('./features/user');

// สร้าง router
const router = express.Router();

// กำหนดว่าหาก request เข้ามาเป็น route = /user ให้เข้าทำงานที่ user
router.use('/user', user);

// ส่งออก เพื่อให้ server ใช้งาน
module.exports = router;