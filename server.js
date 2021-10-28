import app from './src/index.js';
import dotenv from 'dotenv';

dotenv.config();

app.listen(4000, () => {
    console.log(`Server running on port 4000`)
})