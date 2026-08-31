/**
 * Migration: Create password_reset_otps table for forgot-password OTP flow.
 */

module.exports = {
    async up(db) {
        const [exists] = await db.query(
            "SELECT COUNT(*) AS cnt FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'password_reset_otps'"
        );
        if (exists[0].cnt > 0) {
            console.log('password_reset_otps table already exists');
            return;
        }

        await db.query(`
            CREATE TABLE password_reset_otps (
                id            INT AUTO_INCREMENT PRIMARY KEY,
                user_id       INT NOT NULL,
                phone         VARCHAR(20) NOT NULL,
                otp_hash      VARCHAR(64) NOT NULL,
                attempts      TINYINT(1) NOT NULL DEFAULT 0,
                max_attempts  TINYINT(1) NOT NULL DEFAULT 5,
                consumed      TINYINT(1) NOT NULL DEFAULT 0,
                expires_at    DATETIME NOT NULL,
                created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_pwo_user (user_id),
                INDEX idx_pwo_phone (phone),
                INDEX idx_pwo_expires (expires_at)
            )
        `);

        console.log('✅ Created password_reset_otps table');
    },

    async down(db) {
        await db.query('DROP TABLE IF EXISTS password_reset_otps');
        console.log('Dropped password_reset_otps table');
    },
};
