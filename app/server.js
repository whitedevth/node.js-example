// นำเข้า express เพื่อทำ server
const express = require('express');

// นำเข้า swaggerUi เพิ่อสร้างเอกสารเป็น ui
const swaggerUi = require('swagger-ui-express');

// นำเข้าเอกสาร swaggerJSDoc เพื่อสร้างอัตโมมัต
const swaggerJSDoc = require('swagger-jsdoc');

// นำเข้า path เพิ่มจัดการ path
const path = require('path');

// นำเข้า route เพิ่มกระจากกระจายการทำงานไปเส้นทางต่างๆ
const router = require('./router.js');

// สร้าง app
const app = express();

// อ่าน request body แบบ json
app.use(express.json());

// ตั้งค่า swagger
const swaggerDefinition = {
  openapi: '3.0.0',
  info: { title: 'Node.js Example API', version: '1.0.0' },
};

// กำหนด swagger spec
const swaggerSpec = swaggerJSDoc({ swaggerDefinition, apis: [path.join(__dirname, '/features/*.js')] });

// สร้าง route สำหรับ swagger ui
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// กระจายการทำงานไปตาม route
app.use('/', router);

// เริ่ม server ด้วย port 3000
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
  console.log('Swagger docs at http://localhost:3000/api-docs');
});