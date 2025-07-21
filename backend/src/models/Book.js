// MySQL Book Model
class Book {
  constructor(db) {
    this.db = db;
  }

  async create(bookData) {
    const {
      title,
      author,
      isbn,
      genre,
      condition_status = 'Good',
      donor_name,
      donor_mobile,
      donor_address,
      donation_date,
      image_url,
      status = 'Available'
    } = bookData;

    const [result] = await this.db.execute(
      `INSERT INTO books (title, author, isbn, genre, condition_status, donor_name, donor_mobile, donor_address, donation_date, image_url, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, author, isbn, genre, condition_status, donor_name, donor_mobile, donor_address, donation_date, image_url, status]
    );

    return { id: result.insertId, ...bookData };
  }

  async findAll() {
    const [rows] = await this.db.execute('SELECT * FROM books ORDER BY created_at DESC');
    return rows;
  }

  async findById(id) {
    const [rows] = await this.db.execute('SELECT * FROM books WHERE id = ?', [id]);
    return rows[0];
  }

  async findByIsbn(isbn) {
    const [rows] = await this.db.execute('SELECT * FROM books WHERE isbn = ?', [isbn]);
    return rows[0];
  }

  async update(id, updateData) {
    const fields = Object.keys(updateData);
    const values = Object.values(updateData);
    const setClause = fields.map(field => `${field} = ?`).join(', ');

    await this.db.execute(
      `UPDATE books SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [...values, id]
    );

    return this.findById(id);
  }

  async delete(id) {
    const [result] = await this.db.execute('DELETE FROM books WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  async findByGenre(genre) {
    const [rows] = await this.db.execute('SELECT * FROM books WHERE genre = ?', [genre]);
    return rows;
  }

  async findByStatus(status) {
    const [rows] = await this.db.execute('SELECT * FROM books WHERE status = ?', [status]);
    return rows;
  }

  async search(searchTerm) {
    const [rows] = await this.db.execute(
      'SELECT * FROM books WHERE title LIKE ? OR author LIKE ? OR isbn LIKE ?',
      [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]
    );
    return rows;
  }
}

module.exports = Book;
