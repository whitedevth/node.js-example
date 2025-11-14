// นำเข้า express เพิ่อสร้าง router
const express = require('express');

// นำเข้า fs เพื่อจัดการเนื้อหาในไฟล์ json
const fs = require('fs');

// นำเข้า path เพิ่มจัดการ path
const path = require('path');

// สร้าง router
const router = express.Router();

// เตรียม path สำหรับอ่านข้อมูลจาก json
const filePath = path.join(__dirname, '../data/users.json');

// function อ่านข้อมูลจาก json
function readDataFromJson() {
    // อ่านข้อมูลจาก json
    const data = fs.readFileSync(filePath, 'utf-8');

    // แปลงข้อมูลจาก json เป็น object และส่งออก
    return JSON.parse(data);
}

// function เขียนข้อมูลลง json
function writeDataToJson(users) {
    // เขียนข้อมูลลง json
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2), 'utf-8');
}

// function ค้นหาข้อมูล user ทั้งหมด
function getUserList() {
    // อ่านข้อมูลทั้งหมด
    const data = readDataFromJson();

    // ส่งข้อมูลออก
    return data;
}

// function ค้นหาข้อมูล  user ด้วย id
function getUserById(id) {
    // อ่านข้อมูลทั้งหมด
    const data = readDataFromJson();

    // ค้นหาข้อมูลด้วย id
    const user = data.find(u => u.id === Number(req.params.id));

    // หากไม่เจอข้อมูลให้ส่งออกค่า null
    if (!user) {
        return null;
    }

    // ส่งข้อมูลออก
    return user;
}

// function สร้าง user
function createUser(user) {
    // อ่านข้อมูลทั้งหมด
    const data = readDataFromJson();

    // สร้าง user
    const newUser = { id: data.length + 1, ...user };

    // เพิ่มข้อมูลใหม่
    data.push(newUser);

    // เขียนข้อมูลลง json
    writeDataToJson(users);

    // ส่งออกข้อมูล
    return newUser;
}

// function แก้ไข user ด้วย id
function updateUser(id, user) {
    // ดึงข้อมูลทั้งหมด
    const users = getUserList();

    // ค้นหา index ด้วย id
    const userIndex = users.findIndex(u => u.id === Number(req.params.id));

    // หากไม่พบให้ส่งออกค่า null
    if (userIndex < 0) {
        return null;
    }

    // รวมข้อมูล
    users[userIndex] = [...users[userIndex], ...req.body];

    // เขียนข้อมูลลง json
    writeDataToJson(users);

    // ส่งออกข้อมูล
    return users[userIndex];
}

// function ลบ user ด้วย id
function deleteUser(id) {
    // ดึงข้อมูลทั้งหมด
    const users = getUserList();

    // ค้นหา index ด้วย id
    const userIndex = users.findIndex(u => u.id === Number(req.params.id));

    // หากไม่พบให้ส่งออกค่า null
    if (userIndex < 0) {
        return false;
    }

    // ลบ user ออก
    users.splice(userIndex, 1);

    // เขียนข้อมูลลง json
    writeDataToJson(users);

    // ส่งออกข้อมูล
    return true;
}

/**
 * @swagger
 * /user:
 *      get:
 *          summary: Get all users
 *          responses:
 *              200:
 *                  description: OK
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  type: object
 *                                  properties:
 *                                      id:
 *                                          type: integer
 *                                          example: 1
 *                                      name:
 *                                          type: string
 *                                          example: "Name"
 *              404:
 *                  description: Not Found
 */
// กำหนดว่าหาก request เข้ามาเป็น method = get และ route = /user ให้เข้าทำงานที่ function นี้
router.get('/', (_, res) => {
    // ดึงข้อมูลทั้งหมด
    const users = getUserList();

    // หากไม่พบข้อมูลให้ส่งกลับ client ด้วยสถานะ 404
    if (!users || !users.length) {
        return res.status(404).json({ message: 'Not found' });
    }

    // ส่งข้อมูลกลับ client ด้วยสถานะ 200
    res.json(users);
});

/**
 * @swagger
 * /user/{id}:
 *      get:
 *          summary: Get user by id
 *          parameters:
 *              - in: path
 *                name: id
 *                required: true
 *                type: integer
 *          responses:
 *              200:
 *                  description: OK
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  id:
 *                                      type: integer
 *                                      example: 1
 *                                  name:
 *                                      type: string
 *                                      example: "Name"
 *              404:
 *                  description: Not Found
 */
// กำหนดว่าหาก request เข้ามาเป็น method = get และ route = /user/:id ให้เข้าทำงานที่ function นี้
router.get('/:id', (req, res) => {
    // ดึงข้อมูลด้วย id
    const user = getUserById(req.params.id);

    // หากไม่พบให้ส่งกลับ client ด้วย สถานะ 404
    if (!user) {
        return res.status(404).json({ message: 'Not found' });
    }

    // ส่งข้อมูลกลับ client ด้วยสถานะ 200
    res.json(user);
});

/**
 * @swagger
 * /user:
 *      post:
 *          summary: Create new user
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              name:
 *                                  type: string
 *                                  example: "Name"
 *          responses:
 *              201:
 *                  description: OK
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  id:
 *                                      type: integer
 *                                      example: 1
 *                                  name:
 *                                      type: string
 *                                      example: "Name"
 */
// กำหนดว่าหาก request เข้ามาเป็น method = post และ route = / ให้เข้าทำงานที่ function นี้
router.post('/', (req, res) => {
    // สร้าง user
    const newUser = createUser(req.body);

    // ส่งข้อมูลกลับ client ด้วยสถานะ 201
    res.status(201).json(newUser);
});

/**
 * @swagger
 * /user/{id}:
 *      put:
 *          summary: Update user by id
 *          parameters:
 *              - in: path
 *                name: id
 *                required: true
 *                type: integer
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              name:
 *                                  type: string
 *                                  example: "Name"
 *          responses:
 *              200:
 *                  description: OK
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  id:
 *                                      type: integer
 *                                      example: "1"
 *                                  name:
 *                                      type: string
 *                                      example: "Name"
 *              404:
 *                  description: Not Found
 */
// กำหนดว่าหาก request เข้ามาเป็น method = put และ route = / ให้เข้าทำงานที่ function นี้
router.put('/:id', (req, res) => {
    // แก้ไข user
    const user = updateUser(req.params.id, req.body);

    // หากไม่พบให้ส่งกลับ client ด้วย สถานะ 404
    if (!user) {
        return res.status(404).json({ message: 'Not found' });
    }

    // ส่งข้อมูลกลับ client ด้วยสถานะ 200
    res.json(user);
});

/**
 * @swagger
 * /user/{id}:
 *      delete:
 *          summary: Delete user by id
 *          parameters:
 *              - in: path
 *                name: id
 *                required: true
 *                type: integer
 *          responses:
 *              204:
 *                  description: No Content
 *              404:
 *                  description: Not Found
 */
// กำหนดว่าหาก request เข้ามาเป็น method = delete และ route = /:id ให้เข้าทำงานที่ function นี้
router.delete('/:id', (req, res) => {
    // ลบ user
    const result = deleteUser(req.params.id);

    // หากไม่พบให้ส่งกลับ client ด้วย สถานะ 404
    if (!result) {
        return res.status(404).json({ message: 'Not found' });
    }

    // ส่งข้อมูลกลับ client ด้วยสถานะ 204
    res.status(204);
});

// ส่งออก เพื่อให้ router ใช้งาน
module.exports = router;