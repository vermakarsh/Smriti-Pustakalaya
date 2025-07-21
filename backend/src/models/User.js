// MySQL User Model
class User {
  constructor(db) {
    this.db = db;
  }

  async create(userData) {
    const {
      name,
      email,
      phone,
      address,
      user_type = 'Public',
      membership_id,
      is_active = true
    } = userData;

    const [result] = await this.db.execute(
      `INSERT INTO users (name, email, phone, address, user_type, membership_id, is_active) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, email, phone, address, user_type, membership_id, is_active]
    );

    return { id: result.insertId, ...userData };
  }

  async findAll() {
    const [rows] = await this.db.execute('SELECT * FROM users ORDER BY created_at DESC');
    return rows;
  }

  async findById(id) {
    const [rows] = await this.db.execute('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  }

  async findByEmail(email) {
    const [rows] = await this.db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  }

  async findByMembershipId(membership_id) {
    const [rows] = await this.db.execute('SELECT * FROM users WHERE membership_id = ?', [membership_id]);
    return rows[0];
  }

  async update(id, updateData) {
    const fields = Object.keys(updateData);
    const values = Object.values(updateData);
    const setClause = fields.map(field => `${field} = ?`).join(', ');

    await this.db.execute(
      `UPDATE users SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [...values, id]
    );

    return this.findById(id);
  }

  async delete(id) {
    const [result] = await this.db.execute('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  async findByUserType(user_type) {
    const [rows] = await this.db.execute('SELECT * FROM users WHERE user_type = ?', [user_type]);
    return rows;
  }

  async findActive() {
    const [rows] = await this.db.execute('SELECT * FROM users WHERE is_active = true');
    return rows;
  }

  async search(searchTerm) {
    const [rows] = await this.db.execute(
      'SELECT * FROM users WHERE name LIKE ? OR email LIKE ? OR membership_id LIKE ?',
      [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]
    );
    return rows;
  }
}

module.exports = User;
