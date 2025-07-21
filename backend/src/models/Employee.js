// MySQL Employee Model
class Employee {
  constructor(db) {
    this.db = db;
  }

  async create(employeeData) {
    const {
      employee_id,
      name,
      email,
      phone,
      department,
      designation,
      password,
      is_active = true
    } = employeeData;

    const [result] = await this.db.execute(
      `INSERT INTO employees (employee_id, name, email, phone, department, designation, password, is_active) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [employee_id, name, email, phone, department, designation, password, is_active]
    );

    return { id: result.insertId, ...employeeData };
  }

  async findAll() {
    const [rows] = await this.db.execute('SELECT * FROM employees ORDER BY created_at DESC');
    return rows;
  }

  async findById(id) {
    const [rows] = await this.db.execute('SELECT * FROM employees WHERE id = ?', [id]);
    return rows[0];
  }

  async findByEmployeeId(employee_id) {
    const [rows] = await this.db.execute('SELECT * FROM employees WHERE employee_id = ?', [employee_id]);
    return rows[0];
  }

  async findByEmail(email) {
    const [rows] = await this.db.execute('SELECT * FROM employees WHERE email = ?', [email]);
    return rows[0];
  }

  async update(id, updateData) {
    const fields = Object.keys(updateData);
    const values = Object.values(updateData);
    const setClause = fields.map(field => `${field} = ?`).join(', ');

    await this.db.execute(
      `UPDATE employees SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [...values, id]
    );

    return this.findById(id);
  }

  async delete(id) {
    const [result] = await this.db.execute('DELETE FROM employees WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  async findByDepartment(department) {
    const [rows] = await this.db.execute('SELECT * FROM employees WHERE department = ?', [department]);
    return rows;
  }

  async findActive() {
    const [rows] = await this.db.execute('SELECT * FROM employees WHERE is_active = true');
    return rows;
  }

  async validateLogin(employee_id, password) {
    const [rows] = await this.db.execute(
      'SELECT * FROM employees WHERE employee_id = ? AND password = ? AND is_active = true',
      [employee_id, password]
    );
    return rows[0];
  }
}

module.exports = Employee;
